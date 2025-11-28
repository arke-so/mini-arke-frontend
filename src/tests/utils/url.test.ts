import { isValidReturnURL } from '$lib/utils/url';
import { describe, expect, it } from 'vitest';

describe('url', () => {
	describe('isValidReturnURL', () => {
		describe('valid return URLs (same hostname)', () => {
			it('should accept URLs with exact hostname match', () => {
				expect(isValidReturnURL('https://example.com', 'example.com')).toBe(true);
				expect(isValidReturnURL('http://example.com', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://app.example.com', 'app.example.com')).toBe(true);
			});

			it('should accept URLs with paths on same hostname', () => {
				expect(isValidReturnURL('https://example.com/path', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://example.com/path/to/resource', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://example.com/dashboard', 'example.com')).toBe(true);
			});

			it('should accept URLs with query parameters on same hostname', () => {
				expect(isValidReturnURL('https://example.com?foo=bar', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://example.com/path?foo=bar&baz=qux', 'example.com')).toBe(
					true
				);
			});

			it('should accept URLs with hash fragments on same hostname', () => {
				expect(isValidReturnURL('https://example.com#section', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://example.com/path#anchor', 'example.com')).toBe(true);
			});

			it('should accept URLs with ports on same hostname', () => {
				expect(isValidReturnURL('https://example.com:443', 'example.com')).toBe(true);
				expect(isValidReturnURL('http://example.com:80', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://localhost:3000', 'localhost')).toBe(true);
			});

			it('should accept localhost URLs', () => {
				expect(isValidReturnURL('http://localhost', 'localhost')).toBe(true);
				expect(isValidReturnURL('http://localhost:3000', 'localhost')).toBe(true);
				expect(isValidReturnURL('http://localhost/path', 'localhost')).toBe(true);
			});
		});

		describe('invalid return URLs (different hostname)', () => {
			it('should reject URLs with different hostnames', () => {
				expect(isValidReturnURL('https://example.com', 'different.com')).toBe(false);
				expect(isValidReturnURL('https://attacker.com', 'example.com')).toBe(false);
				expect(isValidReturnURL('https://evil.com', 'example.com')).toBe(false);
			});

			it('should reject URLs with subdomain differences', () => {
				expect(isValidReturnURL('https://sub.example.com', 'example.com')).toBe(false);
				expect(isValidReturnURL('https://example.com', 'sub.example.com')).toBe(false);
				expect(isValidReturnURL('https://api.example.com', 'app.example.com')).toBe(false);
			});

			it('should reject URLs attempting subdomain takeover', () => {
				expect(isValidReturnURL('https://example.com.attacker.com', 'example.com')).toBe(false);
				expect(isValidReturnURL('https://exampleXcom', 'example.com')).toBe(false);
			});

			it('should reject URLs with different TLDs', () => {
				expect(isValidReturnURL('https://example.org', 'example.com')).toBe(false);
				expect(isValidReturnURL('https://example.net', 'example.com')).toBe(false);
				expect(isValidReturnURL('https://example.co.uk', 'example.com')).toBe(false);
			});
		});

		describe('protocol handling', () => {
			it('should accept both HTTP and HTTPS for same hostname', () => {
				expect(isValidReturnURL('http://example.com', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://example.com', 'example.com')).toBe(true);
			});

			it('should work regardless of protocol difference', () => {
				expect(isValidReturnURL('http://example.com/path', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://example.com/path', 'example.com')).toBe(true);
			});
		});

		describe('port handling', () => {
			it('should accept URLs with explicit default ports', () => {
				expect(isValidReturnURL('https://example.com:443', 'example.com')).toBe(true);
				expect(isValidReturnURL('http://example.com:80', 'example.com')).toBe(true);
			});

			it('should accept URLs with custom ports on same hostname', () => {
				expect(isValidReturnURL('http://example.com:8080', 'example.com')).toBe(true);
				expect(isValidReturnURL('http://localhost:3000', 'localhost')).toBe(true);
				expect(isValidReturnURL('https://example.com:8443', 'example.com')).toBe(true);
			});

			it('should compare hostname only, not ports', () => {
				// Even with different ports, same hostname should be valid
				expect(isValidReturnURL('http://example.com:8080', 'example.com')).toBe(true);
				expect(isValidReturnURL('http://example.com:9000', 'example.com')).toBe(true);
			});
		});

		describe('malformed and invalid URLs', () => {
			it('should reject malformed URLs', () => {
				expect(isValidReturnURL('not a url', 'example.com')).toBe(false);
				expect(isValidReturnURL('http://', 'example.com')).toBe(false);
				expect(isValidReturnURL('https://', 'example.com')).toBe(false);
			});

			it('should reject relative URLs', () => {
				expect(isValidReturnURL('/path', 'example.com')).toBe(false);
				expect(isValidReturnURL('/path/to/resource', 'example.com')).toBe(false);
				expect(isValidReturnURL('../path', 'example.com')).toBe(false);
			});

			it('should reject protocol-relative URLs', () => {
				expect(isValidReturnURL('//example.com', 'example.com')).toBe(false);
				expect(isValidReturnURL('//attacker.com', 'example.com')).toBe(false);
			});

			it('should reject empty or whitespace strings', () => {
				expect(isValidReturnURL('', 'example.com')).toBe(false);
				expect(isValidReturnURL('   ', 'example.com')).toBe(false);
			});

			it('should reject URLs with spaces', () => {
				expect(isValidReturnURL('https://example .com', 'example.com')).toBe(false);
				expect(isValidReturnURL('https:// example.com', 'example.com')).toBe(false);
			});
		});

		describe('security test cases', () => {
			it('should prevent open redirect to external sites', () => {
				expect(isValidReturnURL('https://evil.com/phishing', 'example.com')).toBe(false);
				expect(isValidReturnURL('http://attacker.com', 'example.com')).toBe(false);
			});

			it('should prevent homograph attacks', () => {
				// Using visually similar domain names
				expect(isValidReturnURL('https://examp1e.com', 'example.com')).toBe(false);
			});

			it('should prevent subdomain confusion attacks', () => {
				expect(isValidReturnURL('https://example.com.attacker.com', 'example.com')).toBe(false);
				expect(isValidReturnURL('https://attacker.com.example.com', 'example.com')).toBe(false);
			});

			it('should handle URLs with authentication credentials', () => {
				// Should still only compare hostname
				expect(isValidReturnURL('https://user:pass@example.com', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://user:pass@attacker.com', 'example.com')).toBe(false);
			});
		});

		describe('edge cases', () => {
			it('should handle IP addresses', () => {
				expect(isValidReturnURL('http://192.168.1.1', '192.168.1.1')).toBe(true);
				expect(isValidReturnURL('http://127.0.0.1', '127.0.0.1')).toBe(true);
				expect(isValidReturnURL('http://192.168.1.1', '192.168.1.2')).toBe(false);
			});

			it('should handle complex URLs', () => {
				expect(
					isValidReturnURL(
						'https://example.com:8080/path/to/resource?query=value&foo=bar#section',
						'example.com'
					)
				).toBe(true);
			});

			it('should handle case differences in hostname', () => {
				expect(isValidReturnURL('https://EXAMPLE.COM', 'example.com')).toBe(true);
				expect(isValidReturnURL('https://example.com', 'EXAMPLE.COM')).toBe(false);
				expect(isValidReturnURL('https://Example.Com', 'example.com')).toBe(true);
			});

			it('should handle special characters in path/query', () => {
				expect(
					isValidReturnURL('https://example.com/path%20with%20spaces', 'example.com')
				).toBe(true);
				expect(isValidReturnURL('https://example.com/path?query=hello%20world', 'example.com')).toBe(
					true
				);
			});
		});
	});
});
