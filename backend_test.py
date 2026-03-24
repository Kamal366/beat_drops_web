#!/usr/bin/env python3
"""
Backend API Testing for Beat Drops Music Class - Updated Focus Areas
Tests the updated backend functionality:
1. Public API health and site-content endpoints
2. Live admission submission behavior after UI change (Preferred class timing removed from UI but backend should still accept/save submissions)
3. Unauthorized admin route behavior for the new admin CRUD APIs
4. If feasible, authenticated admin/student data endpoint sanity checks for the new attendance/backend additions
"""

import requests
import json
import os
from urllib.parse import urljoin

# Get base URL from environment
def get_base_url():
    with open('/app/.env', 'r') as f:
        for line in f:
            if line.startswith('NEXT_PUBLIC_BASE_URL='):
                return line.split('=', 1)[1].strip()
    return os.environ.get('NEXT_PUBLIC_BASE_URL', 'https://drops-student-hub.preview.emergentagent.com')

BASE_URL = get_base_url()
API_BASE = urljoin(BASE_URL, '/api')

print(f"Testing Beat Drops Music Class Backend API - Updated Focus Areas")
print(f"Base URL: {BASE_URL}")
print(f"API Base: {API_BASE}")
print("=" * 80)

def test_health_endpoint():
    """Test GET /api/health endpoint"""
    print("\n🔍 Testing GET /api/health")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Verify expected fields
            required_fields = ['ok', 'app', 'publicSupabaseConfigured', 'serviceSupabaseConfigured']
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False
            
            # Verify Supabase configuration status
            if data.get('publicSupabaseConfigured') != True:
                print(f"❌ Expected publicSupabaseConfigured to be true, got: {data.get('publicSupabaseConfigured')}")
                return False
                
            if data.get('serviceSupabaseConfigured') != True:
                print(f"❌ Expected serviceSupabaseConfigured to be true, got: {data.get('serviceSupabaseConfigured')}")
                return False
            
            # Verify schema status (should be ready now)
            if data.get('schemaReady') != True:
                print(f"❌ Expected schemaReady to be true, got: {data.get('schemaReady')}")
                return False
            
            schema_message = data.get('schemaMessage', '')
            if 'successfully' not in schema_message.lower():
                print(f"❌ Expected schemaMessage to indicate success, got: {schema_message}")
                return False
            
            print("✅ Health endpoint working correctly")
            return True
        else:
            print(f"❌ Health endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Health endpoint test failed with error: {str(e)}")
        return False

def test_site_content_endpoint():
    """Test GET /api/site-content endpoint"""
    print("\n🔍 Testing GET /api/site-content")
    try:
        response = requests.get(f"{API_BASE}/site-content", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response keys: {list(data.keys())}")
            
            # Verify expected data structure
            required_keys = ['academyProfile', 'branches', 'courses', 'banners', 'galleryHighlights', 'testimonials', 'admissionStatuses']
            missing_keys = [key for key in required_keys if key not in data]
            
            if missing_keys:
                print(f"❌ Missing required keys: {missing_keys}")
                return False
            
            # Verify academy profile has required fields
            academy = data.get('academyProfile', {})
            if academy.get('name') != 'Beat Drops Music Class':
                print(f"❌ Expected academy name 'Beat Drops Music Class', got: {academy.get('name')}")
                return False
            
            # Verify contact number is updated to +91 9439395040
            contact_phone = academy.get('phone', '')
            if '+91 9439395040' not in contact_phone:
                print(f"❌ Expected contact number to contain '+91 9439395040', got: {contact_phone}")
                return False
            
            # Verify branches and courses are arrays
            if not isinstance(data.get('branches'), list) or len(data.get('branches', [])) == 0:
                print(f"❌ Expected branches to be non-empty array")
                return False
                
            if not isinstance(data.get('courses'), list) or len(data.get('courses', [])) == 0:
                print(f"❌ Expected courses to be non-empty array")
                return False
            
            # Verify attendance statuses are included
            if 'attendanceStatuses' not in data:
                print(f"❌ Expected attendanceStatuses in site content")
                return False
            
            print("✅ Site content endpoint working correctly with updated contact number")
            return True
        else:
            print(f"❌ Site content endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Site content endpoint test failed with error: {str(e)}")
        return False

def test_admission_without_preferred_timing():
    """Test POST /api/admission behavior after UI change (no preferred_class_timing field)"""
    print("\n🔍 Testing POST /api/admission without preferred_class_timing (UI change)")
    
    # Test 1: Invalid data (missing required fields)
    print("\n📝 Test 1: Invalid admission data")
    try:
        invalid_data = {
            "full_name": "",  # Invalid - too short
            "email": "invalid-email"  # Invalid format
        }
        
        response = requests.post(f"{API_BASE}/admission", json=invalid_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if 'error' in data and 'details' in data:
                print("✅ Validation correctly rejected invalid data")
            else:
                print("❌ Expected error and details fields in validation response")
                return False
        else:
            print(f"❌ Expected 400 status for invalid data, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Invalid data test failed with error: {str(e)}")
        return False
    
    # Test 2: Valid data WITHOUT preferred_class_timing (should succeed with default)
    print("\n📝 Test 2: Valid admission data WITHOUT preferred_class_timing")
    try:
        valid_data_no_timing = {
            "full_name": "Kavya Patel",
            "parent_name": "Rajesh Patel",
            "age": 12,
            "phone_number": "9439395040",
            "email": "kavya.patel@example.com",
            "interested_course": "Light Vocal & Performance",
            "preferred_branch": "Sailashree Vihar Branch",
            # Note: preferred_class_timing is intentionally omitted
            "prior_music_experience": "No prior experience, complete beginner",
            "message": "My daughter is interested in learning Western music and singing"
        }
        
        response = requests.post(f"{API_BASE}/admission", json=valid_data_no_timing, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Verify success response structure
            if 'message' not in data or 'lead' not in data:
                print(f"❌ Expected message and lead fields in success response")
                return False
            
            lead = data.get('lead', {})
            if lead.get('status') != 'new_lead':
                print(f"❌ Expected lead status to be 'new_lead', got: {lead.get('status')}")
                return False
            
            if not lead.get('id'):
                print(f"❌ Expected lead to have an id field")
                return False
            
            print("✅ Admission successfully created new lead without preferred_class_timing")
            return True
        else:
            print(f"❌ Expected 200 status for valid admission, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Valid data test failed with error: {str(e)}")
        return False

def test_unauthorized_admin_routes():
    """Test unauthorized access to new admin CRUD APIs"""
    print("\n🔍 Testing Unauthorized Admin Route Behavior")
    
    admin_routes = [
        ('GET', '/admin/bootstrap'),
        ('PATCH', '/admin/leads/test-id'),
        ('DELETE', '/admin/leads/test-id'),
        ('POST', '/admin/students'),
        ('PATCH', '/admin/students/test-id'),
        ('DELETE', '/admin/students/test-id'),
        ('POST', '/admin/gallery'),
        ('PATCH', '/admin/gallery/test-id'),
        ('DELETE', '/admin/gallery/test-id'),
        ('POST', '/admin/banners'),
        ('PATCH', '/admin/banners/test-id'),
        ('DELETE', '/admin/banners/test-id'),
        ('POST', '/admin/testimonials'),
        ('PATCH', '/admin/testimonials/test-id'),
        ('DELETE', '/admin/testimonials/test-id'),
        ('POST', '/admin/attendance'),
        ('PATCH', '/admin/attendance/test-id'),
        ('DELETE', '/admin/attendance/test-id'),
    ]
    
    all_passed = True
    
    for method, route in admin_routes:
        print(f"\n📝 Testing {method} {route}")
        try:
            url = f"{API_BASE}{route}"
            
            # Prepare request data for POST/PATCH methods
            test_data = {}
            if method in ['POST', 'PATCH']:
                if 'students' in route:
                    test_data = {"full_name": "Test Student", "email": "test@example.com"}
                elif 'gallery' in route:
                    test_data = {"title": "Test Image", "image_url": "https://example.com/test.jpg"}
                elif 'banners' in route:
                    test_data = {"title": "Test Banner", "image_url": "https://example.com/banner.jpg"}
                elif 'testimonials' in route:
                    test_data = {"name": "Test User", "quote": "Great academy!", "rating": 5}
                elif 'attendance' in route:
                    test_data = {"student_id": "test-id", "attendance_date": "2024-01-15", "status": "present"}
                elif 'leads' in route:
                    test_data = {"status": "contacted"}
            
            # Make request without authentication
            if method == 'GET':
                response = requests.get(url, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=test_data, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=test_data, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, timeout=10)
            
            print(f"Status Code: {response.status_code}")
            
            # Should return 403 (Forbidden) for admin routes without authentication
            if response.status_code == 403:
                try:
                    data = response.json()
                    if 'error' in data and 'admin' in data['error'].lower():
                        print(f"✅ Correctly rejected unauthorized access with: {data['error']}")
                    else:
                        print(f"✅ Correctly rejected unauthorized access")
                except:
                    print(f"✅ Correctly rejected unauthorized access (non-JSON response)")
            else:
                print(f"❌ Expected 403 status for unauthorized admin access, got {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                all_passed = False
                
        except Exception as e:
            print(f"❌ Admin route test failed with error: {str(e)}")
            all_passed = False
    
    if all_passed:
        print("\n✅ All admin routes correctly reject unauthorized access")
    else:
        print("\n❌ Some admin routes did not properly reject unauthorized access")
    
    return all_passed

def test_student_dashboard_endpoint():
    """Test GET /api/student/dashboard endpoint (should require auth)"""
    print("\n🔍 Testing GET /api/student/dashboard (should require auth)")
    try:
        response = requests.get(f"{API_BASE}/student/dashboard", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if 'error' in data and 'unauthorized' in data['error'].lower():
                print("✅ Student dashboard correctly requires authentication")
                return True
            else:
                print(f"❌ Expected unauthorized error message")
                return False
        else:
            print(f"❌ Expected 401 status for unauthorized student dashboard access, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Student dashboard test failed with error: {str(e)}")
        return False

def test_protected_routes():
    """Test protected route redirect behavior"""
    print("\n🔍 Testing Protected Route Redirects")
    
    # Test student dashboard redirect
    print("\n📝 Test 1: Student dashboard redirect")
    try:
        response = requests.get(f"{BASE_URL}/student/dashboard", allow_redirects=False, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [302, 307]:
            location = response.headers.get('Location', '')
            print(f"Redirect Location: {location}")
            
            if '/login' in location:
                print("✅ Student dashboard correctly redirects to login")
            else:
                print(f"❌ Expected redirect to login, got: {location}")
                return False
        else:
            print(f"❌ Expected redirect status (302/307), got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Student dashboard redirect test failed with error: {str(e)}")
        return False
    
    # Test admin dashboard redirect
    print("\n📝 Test 2: Admin dashboard redirect")
    try:
        response = requests.get(f"{BASE_URL}/admin/dashboard", allow_redirects=False, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [302, 307]:
            location = response.headers.get('Location', '')
            print(f"Redirect Location: {location}")
            
            if '/login' in location:
                print("✅ Admin dashboard correctly redirects to login")
                return True
            else:
                print(f"❌ Expected redirect to login, got: {location}")
                return False
        else:
            print(f"❌ Expected redirect status (302/307), got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Admin dashboard redirect test failed with error: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("Starting Backend API Tests - Updated Focus Areas...")
    
    results = {
        'health_endpoint': False,
        'site_content_endpoint': False,
        'admission_without_timing': False,
        'unauthorized_admin_routes': False,
        'student_dashboard_auth': False,
        'protected_routes': False
    }
    
    # Test API endpoints
    results['health_endpoint'] = test_health_endpoint()
    results['site_content_endpoint'] = test_site_content_endpoint()
    results['admission_without_timing'] = test_admission_without_preferred_timing()
    results['unauthorized_admin_routes'] = test_unauthorized_admin_routes()
    results['student_dashboard_auth'] = test_student_dashboard_endpoint()
    results['protected_routes'] = test_protected_routes()
    
    # Summary
    print("\n" + "=" * 80)
    print("BACKEND TEST SUMMARY - UPDATED FOCUS AREAS")
    print("=" * 80)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All backend tests passed!")
        return True
    else:
        print("⚠️  Some backend tests failed")
        return False

if __name__ == "__main__":
    main()