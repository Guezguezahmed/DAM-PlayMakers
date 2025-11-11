package tn.esprit.dam.data

import tn.esprit.dam.models.LoginDto
import tn.esprit.dam.models.RegisterDto
import tn.esprit.dam.models.AuthResponse
import tn.esprit.dam.models.ResendVerificationDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface AuthService {

    @POST("auth/register")
    suspend fun register(@Body userData: RegisterDto): retrofit2.Response<AuthResponse>

    @POST("auth/login")
    suspend fun login(@Body credentials: LoginDto): AuthResponse

    @GET("auth/google")
    suspend fun authGoogle(): AuthResponse

    @GET("auth/facebook")
    suspend fun authFacebook(): AuthResponse

    @GET("auth/verify-email")
    suspend fun verifyEmail(@Query("token") token: String): AuthResponse

    @POST("auth/resend-verification")
    suspend fun resendVerification(@Body emailDto: ResendVerificationDto): AuthResponse
}
