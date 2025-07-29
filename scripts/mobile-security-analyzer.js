const fs = require('fs');
const path = require('path');

class MobileSecurityAnalyzer {
  constructor() {
    this.findings = [];
    this.filesScanned = 0;
    this.securityPatterns = {
      insecure_storage: /AsyncStorage\.(setItem|getItem)/g,
      hardcoded_secrets: /(password|secret|key|token)\s*[:=]\s*['"][^'"]{8,}/gi,
      biometric_bypass: /biometric.*disable|skip.*biometric/gi,
      cookie_security: /cookie.*secure\s*:\s*false/gi,
      encryption_weak: /md5|sha1(?!256)/gi,
      debug_logs: /console\.(log|debug|info)\s*\([^)]*(?:password|secret|key|token)/gi,
      unsafe_webview: /WebView.*javaScriptEnabled.*true/gi,
      network_cleartext: /http:\/\/(?!localhost|127\.0\.0\.1)/g
    };
    this.mobileSpecificChecks = {
      keychain_access: /Keychain\.(get|set)GenericPassword/g,
      crypto_usage: /crypto\.(encrypt|decrypt)/g,
      authentication_flow: /Authentication\.(login|auth)/g,
      storage_wrapper: /StorageWrapper\.(get|set)Item/g,
      biometric_auth: /biometric|fingerprint|faceId/gi
    };
  }

  analyzeDirectory(dirPath) {
    const files = this.getJavaScriptFiles(dirPath);
    
    for (const file of files) {
      this.filesScanned++;
      const findings = this.analyzeFile(file);
      this.findings.push(...findings);
    }
  }

  getJavaScriptFiles(dirPath) {
    const files = [];
    
    const traverse = (currentPath) => {
      if (!fs.existsSync(currentPath)) return;
      
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && 
            item !== 'node_modules' && item !== '__tests__' && item !== 'e2e') {
          traverse(fullPath);
        } else if (stat.isFile() && 
                   (item.endsWith('.ts') || item.endsWith('.tsx') || 
                    item.endsWith('.js') || item.endsWith('.jsx')) &&
                   !item.includes('.test.') && !item.includes('.spec.')) {
          files.push(fullPath);
        }
      }
    };
    
    traverse(dirPath);
    return files;
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const findings = [];
      
      for (const [pattern, regex] of Object.entries(this.securityPatterns)) {
        const matches = [...content.matchAll(regex)];
        matches.forEach(match => {
          findings.push({
            type: pattern,
            severity: this.getSeverity(pattern),
            file: path.relative(process.cwd(), filePath),
            line: this.getLineNumber(content, match.index),
            context: this.getContext(content, match.index),
            recommendation: this.getRecommendation(pattern)
          });
        });
      }

      for (const [pattern, regex] of Object.entries(this.mobileSpecificChecks)) {
        const matches = [...content.matchAll(regex)];
        matches.forEach(match => {
          findings.push({
            type: `mobile_${pattern}`,
            severity: 'medium',
            file: path.relative(process.cwd(), filePath),
            line: this.getLineNumber(content, match.index),
            context: this.getContext(content, match.index),
            recommendation: `Review ${pattern} implementation for security best practices`
          });
        });
      }
      
      return findings;
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error.message);
      return [];
    }
  }

  getSeverity(pattern) {
    const highRisk = ['hardcoded_secrets', 'encryption_weak', 'unsafe_webview'];
    const mediumRisk = ['insecure_storage', 'biometric_bypass', 'debug_logs', 'network_cleartext'];
    
    if (highRisk.includes(pattern)) return 'high';
    if (mediumRisk.includes(pattern)) return 'medium';
    return 'low';
  }

  getRecommendation(pattern) {
    const recommendations = {
      insecure_storage: 'Use SecureKeychain or encrypted storage instead of AsyncStorage for sensitive data',
      hardcoded_secrets: 'Move secrets to environment variables or secure configuration',
      biometric_bypass: 'Ensure biometric authentication cannot be easily bypassed',
      cookie_security: 'Enable secure flag for cookies containing sensitive data',
      encryption_weak: 'Use stronger encryption algorithms (AES-256, SHA-256+)',
      debug_logs: 'Remove or sanitize debug logs that may expose sensitive information',
      unsafe_webview: 'Disable JavaScript in WebViews or implement proper security controls',
      network_cleartext: 'Use HTTPS instead of HTTP for network communications'
    };
    return recommendations[pattern] || 'Review for security best practices';
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  getContext(content, index) {
    const lines = content.split('\n');
    const lineNum = this.getLineNumber(content, index) - 1;
    const start = Math.max(0, lineNum - 2);
    const end = Math.min(lines.length, lineNum + 3);
    return lines.slice(start, end).join('\n');
  }

  generateReport() {
    const highRiskFindings = this.findings.filter(f => f.severity === 'high');
    const mediumRiskFindings = this.findings.filter(f => f.severity === 'medium');
    const lowRiskFindings = this.findings.filter(f => f.severity === 'low');

    return {
      timestamp: new Date().toISOString(),
      repository: 'MetaMask Mobile',
      findings: this.findings,
      summary: {
        total_files_scanned: this.filesScanned,
        security_issues_found: this.findings.length,
        high_risk_patterns: highRiskFindings.length,
        medium_risk_patterns: mediumRiskFindings.length,
        low_risk_patterns: lowRiskFindings.length,
        files_with_issues: [...new Set(this.findings.map(f => f.file))].length
      },
      breakdown_by_type: this.getBreakdownByType(),
      top_vulnerable_files: this.getTopVulnerableFiles(),
      mobile_specific_findings: this.getMobileSpecificFindings()
    };
  }

  getBreakdownByType() {
    const breakdown = {};
    for (const finding of this.findings) {
      breakdown[finding.type] = (breakdown[finding.type] || 0) + 1;
    }
    return breakdown;
  }

  getTopVulnerableFiles() {
    const fileCounts = {};
    for (const finding of this.findings) {
      fileCounts[finding.file] = (fileCounts[finding.file] || 0) + 1;
    }
    
    return Object.entries(fileCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([file, count]) => ({ file, issues: count }));
  }

  getMobileSpecificFindings() {
    return this.findings.filter(f => f.type.startsWith('mobile_'));
  }
}

if (require.main === module) {
  const analyzer = new MobileSecurityAnalyzer();
  
  const appDir = path.join(__dirname, '..', 'app');
  analyzer.analyzeDirectory(appDir);
  
  const report = analyzer.generateReport();
  console.log(JSON.stringify(report, null, 2));
}

module.exports = MobileSecurityAnalyzer;
