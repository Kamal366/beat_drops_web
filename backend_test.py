#!/usr/bin/env python3
"""
Backend API Testing for Beat Drops Music Class
Tests the three main backend tasks:
1. GET /api/health and GET /api/site-content
2. POST /api/admission validation behavior
3. Protected-route redirect behavior for private dashboard routes
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
    return 'http://localhost:3000'

BASE_URL = get_base_url()
API_BASE = urljoin(BASE_URL, '/api')

print(f"Testing Beat Drops Music Class Backend API")
print(f"Base URL: {BASE_URL}")
print(f"API Base: {API_BASE}")
print("=" * 60)

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
            
            # Verify branches and courses are arrays
            if not isinstance(data.get('branches'), list) or len(data.get('branches', [])) == 0:
                print(f"❌ Expected branches to be non-empty array")
                return False
                
            if not isinstance(data.get('courses'), list) or len(data.get('courses', [])) == 0:
                print(f"❌ Expected courses to be non-empty array")
                return False
            
            print("✅ Site content endpoint working correctly")
            return True
        else:
            print(f"❌ Site content endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Site content endpoint test failed with error: {str(e)}")
        return False

def test_admission_validation():
    """Test POST /api/admission validation behavior"""
    print("\n🔍 Testing POST /api/admission validation")
    
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
    
    # Test 2: Valid data (should succeed with 200 and create new_lead)
    print("\n📝 Test 2: Valid admission data (should succeed)")
    try:
        valid_data = {
            "full_name": "Arjun Sharma",
            "parent_name": "Priya Sharma",
            "age": 14,
            "phone_number": "9876543210",
            "email": "arjun.sharma@example.com",
            "interested_course": "Hindustani Vocal",
            "preferred_branch": "Sailashree Vihar Branch",
            "preferred_class_timing": "Evening 6-8 PM",
            "prior_music_experience": "Beginner level, learned basics at school",
            "message": "Excited to learn classical music and improve my singing skills"
        }
        
        response = requests.post(f"{API_BASE}/admission", json=valid_data, timeout=10)
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
            
            print("✅ Admission successfully created new lead")
            return True
        else:
            print(f"❌ Expected 200 status for valid admission, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Valid data test failed with error: {str(e)}")
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
    print("Starting Backend API Tests...")
    
    results = {
        'health_endpoint': False,
        'site_content_endpoint': False,
        'admission_validation': False,
        'protected_routes': False
    }
    
    # Test API endpoints
    results['health_endpoint'] = test_health_endpoint()
    results['site_content_endpoint'] = test_site_content_endpoint()
    results['admission_validation'] = test_admission_validation()
    results['protected_routes'] = test_protected_routes()
    
    # Summary
    print("\n" + "=" * 60)
    print("BACKEND TEST SUMMARY")
    print("=" * 60)
    
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