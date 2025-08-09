# Flutter Integration Guide

## Flutter HTTP Service for Compass Backend

### 1. Add Dependencies

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  # Optional: for better JSON handling
  json_annotation: ^4.8.1

dev_dependencies:
  # Optional: for generating JSON serialization code
  json_serializable: ^6.7.1
  build_runner: ^2.4.7
```

### 2. Create Models

```dart
// lib/models/nomination.dart
class Nomination {
  final int? id;
  final String name;
  final String course;
  final String phoneNo;
  final String domain;
  final String email;
  final String? instaId;
  final String? githubId;
  final String gender;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Nomination({
    this.id,
    required this.name,
    required this.course,
    required this.phoneNo,
    required this.domain,
    required this.email,
    this.instaId,
    this.githubId,
    required this.gender,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'course': course,
      'phone_no': phoneNo,
      'domain': domain,
      'email': email,
      'insta_id': instaId,
      'github_id': githubId,
      'gender': gender,
    };
  }

  factory Nomination.fromJson(Map<String, dynamic> json) {
    return Nomination(
      id: json['id'],
      name: json['name'],
      course: json['course'],
      phoneNo: json['phone_no'],
      domain: json['domain'],
      email: json['email'],
      instaId: json['insta_id'],
      githubId: json['github_id'],
      gender: json['gender'],
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : null,
      updatedAt: json['updated_at'] != null 
          ? DateTime.parse(json['updated_at']) 
          : null,
    );
  }
}
```

### 3. Create API Service

```dart
// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/nomination.dart';

class ApiService {
  static const String baseUrl = 'http://your-server-ip:3000/api';
  // For Android emulator use: http://10.0.2.2:3000/api
  // For iOS simulator use: http://localhost:3000/api
  // For physical device use your computer's IP: http://192.168.1.xxx:3000/api

  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
  };

  // Create nomination
  static Future<ApiResponse<Nomination>> createNomination(Nomination nomination) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/nominations'),
        headers: headers,
        body: json.encode(nomination.toJson()),
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 201) {
        return ApiResponse.success(
          Nomination.fromJson(data['data']),
          data['message'],
        );
      } else {
        return ApiResponse.error(data['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }

  // Get all nominations
  static Future<ApiResponse<List<Nomination>>> getNominations({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/nominations?page=$page&limit=$limit'),
        headers: headers,
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 200) {
        final nominations = (data['data']['nominations'] as List)
            .map((item) => Nomination.fromJson(item))
            .toList();
        
        return ApiResponse.success(nominations, data['message']);
      } else {
        return ApiResponse.error(data['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }

  // Get nomination by ID
  static Future<ApiResponse<Nomination>> getNominationById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/nominations/$id'),
        headers: headers,
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 200) {
        return ApiResponse.success(
          Nomination.fromJson(data['data']),
          data['message'],
        );
      } else {
        return ApiResponse.error(data['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }

  // Get available domains
  static Future<ApiResponse<List<String>>> getDomains() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/nominations/domains'),
        headers: headers,
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 200) {
        final domains = List<String>.from(data['data']);
        return ApiResponse.success(domains, data['message']);
      } else {
        return ApiResponse.error(data['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }

  // Get statistics
  static Future<ApiResponse<Map<String, dynamic>>> getStats() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/nominations/stats'),
        headers: headers,
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 200) {
        return ApiResponse.success(data['data'], data['message']);
      } else {
        return ApiResponse.error(data['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }

  // Update nomination
  static Future<ApiResponse<Nomination>> updateNomination(
    int id, 
    Nomination nomination,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/nominations/$id'),
        headers: headers,
        body: json.encode(nomination.toJson()),
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 200) {
        return ApiResponse.success(
          Nomination.fromJson(data['data']),
          data['message'],
        );
      } else {
        return ApiResponse.error(data['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }

  // Delete nomination
  static Future<ApiResponse<bool>> deleteNomination(int id) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/nominations/$id'),
        headers: headers,
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 200) {
        return ApiResponse.success(true, data['message']);
      } else {
        return ApiResponse.error(data['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
}

// API Response wrapper
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String message;

  ApiResponse._({
    required this.success,
    this.data,
    required this.message,
  });

  factory ApiResponse.success(T data, String message) {
    return ApiResponse._(
      success: true,
      data: data,
      message: message,
    );
  }

  factory ApiResponse.error(String message) {
    return ApiResponse._(
      success: false,
      message: message,
    );
  }
}
```

### 4. Create Nomination Form

```dart
// lib/screens/nomination_form.dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/nomination.dart';

class NominationForm extends StatefulWidget {
  @override
  _NominationFormState createState() => _NominationFormState();
}

class _NominationFormState extends State<NominationForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _courseController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _instaController = TextEditingController();
  final _githubController = TextEditingController();

  String? _selectedDomain;
  String? _selectedGender;
  List<String> _domains = [];
  bool _isLoading = false;

  final List<String> _genders = ['Male', 'Female', 'Others'];

  @override
  void initState() {
    super.initState();
    _loadDomains();
  }

  Future<void> _loadDomains() async {
    final response = await ApiService.getDomains();
    if (response.success && response.data != null) {
      setState(() {
        _domains = response.data!;
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final nomination = Nomination(
      name: _nameController.text.trim(),
      course: _courseController.text.trim(),
      phoneNo: _phoneController.text.trim(),
      domain: _selectedDomain!,
      email: _emailController.text.trim(),
      instaId: _instaController.text.trim().isEmpty 
          ? null 
          : _instaController.text.trim(),
      githubId: _githubController.text.trim().isEmpty 
          ? null 
          : _githubController.text.trim(),
      gender: _selectedGender!,
    );

    final response = await ApiService.createNomination(nomination);

    setState(() {
      _isLoading = false;
    });

    if (response.success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(response.message),
          backgroundColor: Colors.green,
        ),
      );
      _resetForm();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(response.message),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _resetForm() {
    _formKey.currentState!.reset();
    _nameController.clear();
    _courseController.clear();
    _phoneController.clear();
    _emailController.clear();
    _instaController.clear();
    _githubController.clear();
    setState(() {
      _selectedDomain = null;
      _selectedGender = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Nomination Form'),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Name *',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Name is required';
                  }
                  if (value.trim().length < 2) {
                    return 'Name must be at least 2 characters';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              
              TextFormField(
                controller: _courseController,
                decoration: InputDecoration(
                  labelText: 'Course *',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Course is required';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              
              TextFormField(
                controller: _phoneController,
                decoration: InputDecoration(
                  labelText: 'Phone Number *',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Phone number is required';
                  }
                  if (!RegExp(r'^[+]?[0-9]{10,15}$').hasMatch(value.trim())) {
                    return 'Please enter a valid phone number';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              
              DropdownButtonFormField<String>(
                value: _selectedDomain,
                decoration: InputDecoration(
                  labelText: 'Domain *',
                  border: OutlineInputBorder(),
                ),
                items: _domains.map((domain) {
                  return DropdownMenuItem(
                    value: domain,
                    child: Text(domain),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedDomain = value;
                  });
                },
                validator: (value) {
                  if (value == null) {
                    return 'Please select a domain';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(
                  labelText: 'Email *',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Email is required';
                  }
                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value.trim())) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              
              TextFormField(
                controller: _instaController,
                decoration: InputDecoration(
                  labelText: 'Instagram ID',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              
              TextFormField(
                controller: _githubController,
                decoration: InputDecoration(
                  labelText: 'GitHub ID',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              
              DropdownButtonFormField<String>(
                value: _selectedGender,
                decoration: InputDecoration(
                  labelText: 'Gender *',
                  border: OutlineInputBorder(),
                ),
                items: _genders.map((gender) {
                  return DropdownMenuItem(
                    value: gender,
                    child: Text(gender),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedGender = value;
                  });
                },
                validator: (value) {
                  if (value == null) {
                    return 'Please select a gender';
                  }
                  return null;
                },
              ),
              SizedBox(height: 24),
              
              ElevatedButton(
                onPressed: _isLoading ? null : _submitForm,
                child: _isLoading
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text('Submit Nomination'),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _courseController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _instaController.dispose();
    _githubController.dispose();
    super.dispose();
  }
}
```

### 5. Network Security Configuration (Android)

Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">192.168.1.0/24</domain>
    </domain-config>
</network-security-config>
```

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ... >
```

### 6. Usage Example

```dart
// In your main.dart or wherever you want to use the form
import 'package:flutter/material.dart';
import 'screens/nomination_form.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Compass Nominations',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: NominationForm(),
    );
  }
}
```

### Important Notes:

1. **Base URL**: Change `baseUrl` in `ApiService` to match your server's IP address
2. **Network Permissions**: Make sure to add internet permission in Android manifest
3. **HTTPS**: For production, use HTTPS endpoints
4. **Error Handling**: The example includes basic error handling, expand as needed
5. **Loading States**: Loading indicators are included for better UX

This integration provides a complete Flutter frontend for your Compass nomination backend!
