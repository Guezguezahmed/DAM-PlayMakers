package tn.esprit.dam.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.POST
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.Path
import tn.esprit.dam.api.dto.CreateCoupeRequest

// DTO for GET /api/v1/coupes response
// We'll define CoupeDto in a moment

data class CoupeDto(
    val _id: String,
    val nom: String,
    val id_organisateur: OrganisateurDto,
    val participants: List<Any>,
    val matches: List<Any>,
    val date_debut: String,
    val date_fin: String,
    val categorie: String,
    val type: String,
    val tournamentName: String,
    val stadium: String,
    val date: String,
    val time: String,
    val maxParticipants: Int,
    val entryFee: Int?,
    val prizePool: Int?,
    val referee: List<String>,
    val createdAt: String,
    val updatedAt: String,
    val __v: Int
)

data class OrganisateurDto(
    val _id: String,
    val prenom: String?,
    val nom: String?
)

// DTO for GET /api/v1/users/{id}
data class UserDto(
    val _id: String,
    val prenom: String?,
    val nom: String?
)

data class AddParticipantRequest(val userId: String)

interface TournamentApiService {
    @Headers("Content-Type: application/json")
    @POST("create-coupe")
    suspend fun createCoupeWithAuth(
        @Body request: CreateCoupeRequest,
        @Header("Authorization") authHeader: String
    ): Response<Unit>

    @GET("coupes")
    suspend fun getCoupesWithAuth(
        @Header("Authorization") authHeader: String
    ): Response<List<CoupeDto>>

    @GET("users/{id}")
    suspend fun getUserByIdWithAuth(
        @Path("id") id: String,
        @Header("Authorization") authHeader: String
    ): Response<UserDto>

    @PATCH("add-participant/{id}")
    suspend fun addParticipantWithAuth(
        @Path("id") coupeId: String,
        @Body request: AddParticipantRequest,
        @Header("Authorization") authHeader: String
    ): Response<Unit>
}
