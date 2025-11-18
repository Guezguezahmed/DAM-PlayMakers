package tn.esprit.dam.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import tn.esprit.dam.api.dto.CreateCoupeRequest

interface TournamentApiService {
    @POST("/api/v1/create-coupe")
    suspend fun createCoupe(@Body request: CreateCoupeRequest): Response<Unit>
}

