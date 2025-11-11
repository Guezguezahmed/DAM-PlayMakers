package tn.esprit.dam.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// --- DTO for Authentication Responses ---
@Serializable
data class AuthResponse(
    // The server might return the token as 'token'
    val token: String? = null,
    // The server might return the token as 'accessToken' (ADDED THIS FIX)
    val accessToken: String? = null,
    val user: User? = null,
    val message: String? = null,
    // Additional fields that might be present
    val data: User? = null, // Some APIs wrap user in 'data'
    val success: Boolean? = null, // Some APIs return success flag
    val status: String? = null // Some APIs return status
)

// --- DTO for User Login Request ---
@Serializable
data class LoginDto(
    val email: String,
    val password: String
)

// --- DTO for User Registration Request (CRITICAL FIX HERE) ---
// We use @SerialName to map our readable Kotlin field names (camelCase)
// to the API's required field names (lowercase/snake_case: prenom, nom, tel, age).
@Serializable
data class RegisterDto(
    // UI: firstName -> API: prenom
    @SerialName("prenom")
    val firstName: String,

    // UI: lastName -> API: nom
    @SerialName("nom")
    val lastName: String,

    // API: email
    val email: String,

    // UI: phoneNumber -> API: tel
    @SerialName("tel")
    val phoneNumber: String,

    // UI: birthDate -> API: age (This must contain the date in "YYYY-MM-DD" format)
    @SerialName("age")
    val birthDate: String,

    // API: role
    val role: String,

    // API: password
    val password: String
)

// --- User Model (Assuming this is what the AuthResponse 'user' field looks like) ---
@Serializable
data class User(
    val id: String,
    val prenom: String,
    val nom: String,
    val email: String,
    val tel: String? = null,
    val role: String,
    val age: String? = null, // Store as String (YYYY-MM-DD)
    @SerialName("isVerified")
    val isVerified: Boolean = false
)

// --- Resend Verification Email Request DTO ---
@Serializable
data class ResendVerificationDto(
    val email: String
)

// --- Error Response Model ---
@Serializable
data class ErrorResponse(
    val message: String? = null,
    val error: String? = null,
    val statusCode: Int? = null
)