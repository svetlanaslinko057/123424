#!/usr/bin/env python3
"""
Y-Store V2.0 Roadmap Backend Testing
Testing: Guest Checkout, Google Auth, Catalog V2
Features: V2 Auth APIs, Products/Categories APIs
"""

import requests
import sys
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from frontend .env for public URL
load_dotenv('/app/frontend/.env')

class YStoreV2Tester:
    def __init__(self, base_url=None):
        # Use public URL from environment
        if base_url is None:
            self.base_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
        else:
            self.base_url = base_url
            
        self.tests_run = 0
        self.tests_passed = 0
        
        # Test data for guest checkout
        self.test_guest_data = {
            "full_name": "Test Guest User",
            "phone": "+38 099 123 45 67",
            "email": "test@guest.com"
        }

    def log_result(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")
        return success

    def make_request(self, method, endpoint, data=None, headers=None, expect_status=200, use_cookies=True):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}/api{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        if headers:
            req_headers.update(headers)
        
        print(f"Making {method} request to: {url}")
        
        try:
            session = requests.Session() if use_cookies else requests
            
            if method == 'GET':
                response = session.get(url, headers=req_headers, timeout=30)
            elif method == 'POST':
                response = session.post(url, json=data, headers=req_headers, timeout=30)
            else:
                return None, f"Unsupported method: {method}"
            
            success = response.status_code == expect_status
            result_data = {}
            try:
                result_data = response.json()
            except:
                result_data = {"text": response.text}
            
            return {
                "success": success,
                "status_code": response.status_code,
                "data": result_data,
                "expected_status": expect_status,
                "cookies": response.cookies if hasattr(response, 'cookies') else None
            }, None
            
        except requests.exceptions.Timeout:
            return None, "Request timeout"
        except requests.exceptions.ConnectionError:
            return None, "Connection error"
        except Exception as e:
            return None, f"Request failed: {str(e)}"

    def test_v2_auth_guest_create(self):
        """Test POST /api/v2/auth/guest - Create guest session"""
        print(f"\n🔍 Testing V2 Guest Auth - Create Session...")
        
        response, error = self.make_request(
            'POST', '/v2/auth/guest',
            data=self.test_guest_data,
            expect_status=200
        )
        
        if error:
            return self.log_result("V2 Guest Auth Create", False, f"Error: {error}")
        
        if response["success"]:
            data = response["data"]
            # Check for required fields from auth_v2_routes.py
            required_fields = ['guest_token', 'guest_id']
            has_fields = all(field in data for field in required_fields)
            
            if has_fields:
                # Store for potential follow-up tests
                self.guest_token = data['guest_token']
                self.guest_id = data['guest_id']
                return self.log_result("V2 Guest Auth Create", True,
                    f"Created guest session: {data['guest_id']}, token length: {len(data['guest_token'])}")
            else:
                missing = [f for f in required_fields if f not in data]
                return self.log_result("V2 Guest Auth Create", False,
                    f"Missing fields: {missing}")
        else:
            return self.log_result("V2 Guest Auth Create", False,
                f"Status: {response['status_code']}, Data: {response['data']}")

    def test_v2_auth_guest_get(self):
        """Test GET /api/v2/auth/guest/{guest_token} - Get guest session"""
        print(f"\n🔍 Testing V2 Guest Auth - Get Session...")
        
        if not hasattr(self, 'guest_token'):
            return self.log_result("V2 Guest Auth Get", False, "No guest token available")
        
        response, error = self.make_request(
            'GET', f'/v2/auth/guest/{self.guest_token}',
            expect_status=200
        )
        
        if error:
            return self.log_result("V2 Guest Auth Get", False, f"Error: {error}")
        
        if response["success"]:
            data = response["data"]
            # Should contain guest session data
            expected_fields = ['guest_id', 'guest_token', 'full_name', 'phone']
            has_fields = all(field in data for field in expected_fields)
            
            if has_fields and data['guest_id'] == self.guest_id:
                return self.log_result("V2 Guest Auth Get", True,
                    f"Retrieved guest session for: {data['full_name']}")
            else:
                return self.log_result("V2 Guest Auth Get", False,
                    f"Invalid session data: {data}")
        else:
            return self.log_result("V2 Guest Auth Get", False,
                f"Status: {response['status_code']}, Data: {response['data']}")

    def test_v2_auth_me(self):
        """Test GET /api/v2/auth/me - Get current user (unauthenticated should fail)"""
        print(f"\n🔍 Testing V2 Auth Me - No Session...")
        
        response, error = self.make_request(
            'GET', '/v2/auth/me',
            expect_status=401  # Should fail without session
        )
        
        if error:
            return self.log_result("V2 Auth Me (Unauth)", False, f"Error: {error}")
        
        # 401 Unauthorized is expected
        if response["status_code"] == 401:
            return self.log_result("V2 Auth Me (Unauth)", True,
                "Correctly returns 401 without session")
        else:
            return self.log_result("V2 Auth Me (Unauth)", False,
                f"Expected 401, got {response['status_code']}")

    def test_products_api(self):
        """Test GET /api/products - Should have 43 products"""
        print(f"\n🔍 Testing Products API - Should have 43 products...")
        
        response, error = self.make_request(
            'GET', '/products',
            expect_status=200
        )
        
        if error:
            return self.log_result("Products API", False, f"Error: {error}")
        
        if response["success"]:
            data = response["data"]
            
            # Handle different response formats
            if isinstance(data, list):
                products = data
            elif isinstance(data, dict) and 'items' in data:
                products = data['items']
            elif isinstance(data, dict) and 'products' in data:
                products = data['products']
            else:
                products = []
            
            if isinstance(products, list):
                product_count = len(products)
                # Should have 43 products as specified in requirements
                has_expected_count = product_count == 43
                
                if has_expected_count:
                    return self.log_result("Products API", True,
                        f"Found {product_count} products (as expected)")
                else:
                    return self.log_result("Products API", False,
                        f"Found {product_count} products, expected 43")
            else:
                return self.log_result("Products API", False,
                    f"Invalid products format: {type(products)}")
        else:
            return self.log_result("Products API", False,
                f"Status: {response['status_code']}, Data: {response['data']}")

    def test_categories_api(self):
        """Test GET /api/categories - Should have 10 categories"""
        print(f"\n🔍 Testing Categories API - Should have 10 categories...")
        
        response, error = self.make_request(
            'GET', '/categories',
            expect_status=200
        )
        
        if error:
            return self.log_result("Categories API", False, f"Error: {error}")
        
        if response["success"]:
            data = response["data"]
            
            # Handle different response formats
            if isinstance(data, list):
                categories = data
            elif isinstance(data, dict) and 'items' in data:
                categories = data['items']
            elif isinstance(data, dict) and 'categories' in data:
                categories = data['categories']
            else:
                categories = []
            
            if isinstance(categories, list):
                category_count = len(categories)
                # Should have 10 categories as specified in requirements
                has_expected_count = category_count == 10
                
                if has_expected_count:
                    return self.log_result("Categories API", True,
                        f"Found {category_count} categories (as expected)")
                else:
                    return self.log_result("Categories API", False,
                        f"Found {category_count} categories, expected 10")
            else:
                return self.log_result("Categories API", False,
                    f"Invalid categories format: {type(categories)}")
        else:
            return self.log_result("Categories API", False,
                f"Status: {response['status_code']}, Data: {response['data']}")

    def test_health_check(self):
        """Test GET /api/health - Basic connectivity"""
        print(f"\n🔍 Testing Health Check...")
        
        response, error = self.make_request(
            'GET', '/health',
            expect_status=200
        )
        
        if error:
            return self.log_result("Health Check", False, f"Error: {error}")
        
        if response["success"]:
            data = response["data"]
            is_healthy = data.get('status') == 'ok'
            return self.log_result("Health Check", is_healthy,
                f"Status: {data.get('status')}")
        else:
            return self.log_result("Health Check", False,
                f"Status: {response['status_code']}, Data: {response['data']}")

    def run_all_tests(self):
        """Run all V2.0 backend tests"""
        print("🚀 Starting Y-Store V2.0 Roadmap Backend Tests")
        print("🎯 Testing Guest Checkout, Google Auth, Catalog V2")
        print("=" * 80)
        
        # Basic connectivity test
        if not self.test_health_check():
            print("❌ Health check failed - check backend connectivity")
        
        # V2 Auth Guest Checkout API tests
        print(f"\n{'='*20} V2 Guest Checkout Tests {'='*20}")
        self.test_v2_auth_guest_create()
        if hasattr(self, 'guest_token'):
            self.test_v2_auth_guest_get()
        
        # V2 Auth Me test
        print(f"\n{'='*20} V2 Auth Session Tests {'='*20}")
        self.test_v2_auth_me()
        
        # Catalog V2 tests - Products and Categories
        print(f"\n{'='*20} Catalog V2 Tests {'='*20}")
        self.test_products_api()
        self.test_categories_api()
        
        print("\n" + "=" * 80)
        print(f"📊 V2.0 Test Results: {self.tests_passed}/{self.tests_run} passed")
        print("=" * 80)
        
        return self.tests_passed >= (self.tests_run * 0.8)  # 80% pass rate


def main():
    """Main test runner"""
    tester = YStoreV2Tester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 V2.0 Backend tests completed successfully!")
        return 0
    else:
        print("💥 Some V2.0 tests failed!")
        return 1


if __name__ == "__main__":
    sys.exit(main())