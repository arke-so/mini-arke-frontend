import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidUrl } from '$lib/utils/validation';

describe('validation', () => {
	describe('isValidEmail', () => {
		describe('valid emails', () => {
			it('should validate standard email addresses', () => {
				expect(isValidEmail('user@example.com')).toBe(true);
				expect(isValidEmail('test@test.org')).toBe(true);
				expect(isValidEmail('hello@world.net')).toBe(true);
			});

			it('should validate emails with dots in local part', () => {
				expect(isValidEmail('first.last@example.com')).toBe(true);
				expect(isValidEmail('user.name.test@example.com')).toBe(true);
			});

			it('should validate emails with numbers', () => {
				expect(isValidEmail('user123@example.com')).toBe(true);
				expect(isValidEmail('123@example.com')).toBe(true);
				expect(isValidEmail('test@example123.com')).toBe(true);
			});

			it('should validate emails with hyphens', () => {
				expect(isValidEmail('user-name@example.com')).toBe(true);
				expect(isValidEmail('test@my-domain.com')).toBe(true);
			});

			it('should validate emails with underscores', () => {
				expect(isValidEmail('user_name@example.com')).toBe(true);
				expect(isValidEmail('test_user@example.com')).toBe(true);
			});

			it('should validate emails with plus signs', () => {
				expect(isValidEmail('user+tag@example.com')).toBe(true);
				expect(isValidEmail('test+filter@example.com')).toBe(true);
			});

			it('should validate emails with subdomains', () => {
				expect(isValidEmail('user@mail.example.com')).toBe(true);
				expect(isValidEmail('test@sub.domain.example.com')).toBe(true);
			});

			it('should validate emails with different TLDs', () => {
				expect(isValidEmail('user@example.co.uk')).toBe(true);
				expect(isValidEmail('test@example.io')).toBe(true);
				expect(isValidEmail('hello@example.dev')).toBe(true);
			});
		});

		describe('invalid emails', () => {
			it('should reject emails without @ symbol', () => {
				expect(isValidEmail('userexample.com')).toBe(false);
				expect(isValidEmail('test.example.com')).toBe(false);
			});

			it('should reject emails without domain', () => {
				expect(isValidEmail('user@')).toBe(false);
				expect(isValidEmail('test@.')).toBe(false);
			});

			it('should reject emails without local part', () => {
				expect(isValidEmail('@example.com')).toBe(false);
			});

			it('should reject emails without TLD', () => {
				expect(isValidEmail('user@example')).toBe(false);
				expect(isValidEmail('test@domain')).toBe(false);
			});

			it('should reject emails with spaces', () => {
				expect(isValidEmail('user @example.com')).toBe(false);
				expect(isValidEmail('user@ example.com')).toBe(false);
				expect(isValidEmail('user@example .com')).toBe(false);
				expect(isValidEmail(' user@example.com')).toBe(false);
				expect(isValidEmail('user@example.com ')).toBe(false);
			});

			it('should reject emails with multiple @ symbols', () => {
				expect(isValidEmail('user@@example.com')).toBe(false);
				expect(isValidEmail('user@test@example.com')).toBe(false);
			});

			it('should reject empty string', () => {
				expect(isValidEmail('')).toBe(false);
			});

			it('should reject emails with invalid characters', () => {
				expect(isValidEmail('user name@example.com')).toBe(false);
				expect(isValidEmail('user@exam ple.com')).toBe(false);
			});

			it('should reject malformed email addresses', () => {
				expect(isValidEmail('user')).toBe(false);
				expect(isValidEmail('example.com')).toBe(false);
				expect(isValidEmail('user@.com')).toBe(false);
			});

			it('should reject emails starting with special characters', () => {
				expect(isValidEmail('.user@example.com')).toBe(false);
				expect(isValidEmail('-user@example.com')).toBe(false);
				expect(isValidEmail('_user@example.com')).toBe(false);
				expect(isValidEmail('+user@example.com')).toBe(false);
			});
		});
	});

	describe('isValidUrl', () => {
		describe('valid URLs', () => {
			it('should validate standard HTTP URLs', () => {
				expect(isValidUrl('http://example.com')).toBe(true);
				expect(isValidUrl('http://www.example.com')).toBe(true);
			});

			it('should validate standard HTTPS URLs', () => {
				expect(isValidUrl('https://example.com')).toBe(true);
				expect(isValidUrl('https://www.example.com')).toBe(true);
			});

			it('should validate URLs with paths', () => {
				expect(isValidUrl('https://example.com/path')).toBe(true);
				expect(isValidUrl('https://example.com/path/to/resource')).toBe(true);
				expect(isValidUrl('https://example.com/path/to/resource.html')).toBe(true);
			});

			it('should validate URLs with query parameters', () => {
				expect(isValidUrl('https://example.com?query=value')).toBe(true);
				expect(isValidUrl('https://example.com/path?foo=bar&baz=qux')).toBe(true);
			});

			it('should validate URLs with hash fragments', () => {
				expect(isValidUrl('https://example.com#section')).toBe(true);
				expect(isValidUrl('https://example.com/path#anchor')).toBe(true);
			});

			it('should validate URLs with ports', () => {
				expect(isValidUrl('http://example.com:8080')).toBe(true);
				expect(isValidUrl('https://example.com:3000')).toBe(true);
				expect(isValidUrl('http://localhost:8080')).toBe(true);
			});

			it('should validate URLs with subdomains', () => {
				expect(isValidUrl('https://api.example.com')).toBe(true);
				expect(isValidUrl('https://sub.domain.example.com')).toBe(true);
			});

			it('should validate URLs with IP addresses', () => {
				expect(isValidUrl('http://192.168.1.1')).toBe(true);
				expect(isValidUrl('http://127.0.0.1:8080')).toBe(true);
			});

			it('should validate localhost URLs', () => {
				expect(isValidUrl('http://localhost')).toBe(true);
				expect(isValidUrl('http://localhost:3000')).toBe(true);
			});

			it('should validate URLs with authentication', () => {
				expect(isValidUrl('https://user:pass@example.com')).toBe(true);
			});
		});

		describe('invalid URLs', () => {
			it('should reject non-HTTP/HTTPS protocols', () => {
				expect(isValidUrl('ftp://example.com')).toBe(false);
				expect(isValidUrl('file:///path/to/file')).toBe(false);
				expect(isValidUrl('mailto:test@example.com')).toBe(false);
				expect(isValidUrl('tel:+1234567890')).toBe(false);
			});

			it('should reject URLs without protocol', () => {
				expect(isValidUrl('example.com')).toBe(false);
				expect(isValidUrl('www.example.com')).toBe(false);
				expect(isValidUrl('//example.com')).toBe(false);
			});

			it('should reject empty string', () => {
				expect(isValidUrl('')).toBe(false);
			});

			it('should reject invalid URL formats', () => {
				expect(isValidUrl('not a url')).toBe(false);
				expect(isValidUrl('http://')).toBe(false);
				expect(isValidUrl('https://')).toBe(false);
			});

			it('should reject malformed URLs', () => {
				expect(isValidUrl('http:// example.com')).toBe(false);
				expect(isValidUrl('https://exam ple.com')).toBe(false);
			});

			it('should reject URLs with only protocol', () => {
				expect(isValidUrl('http://')).toBe(false);
				expect(isValidUrl('https://')).toBe(false);
			});
		});

		describe('edge cases', () => {
			it('should handle URLs with special characters in path', () => {
				expect(isValidUrl('https://example.com/path%20with%20spaces')).toBe(true);
				expect(isValidUrl('https://example.com/path-with-dashes')).toBe(true);
				expect(isValidUrl('https://example.com/path_with_underscores')).toBe(true);
			});

			it('should handle complex URLs', () => {
				expect(
					isValidUrl('https://user:pass@sub.example.com:8080/path/to/page?q=test&foo=bar#section')
				).toBe(true);
			});

			it('should handle URLs with different TLDs', () => {
				expect(isValidUrl('https://example.co.uk')).toBe(true);
				expect(isValidUrl('https://example.io')).toBe(true);
				expect(isValidUrl('https://example.dev')).toBe(true);
			});
		});
	});
});
