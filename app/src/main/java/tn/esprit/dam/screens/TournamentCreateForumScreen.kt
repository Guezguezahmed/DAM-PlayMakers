package tn.esprit.dam.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch
import android.widget.Toast
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.platform.LocalContext
import tn.esprit.dam.api.dto.CreateCoupeRequest
import tn.esprit.dam.data.RetrofitClient
import tn.esprit.dam.ui.theme.DAMTheme
import java.util.Locale

/*
Example values to use in the TournamentCreateForumScreen fields:

Tournament Name: Champions League 2025
Stadium: National Stadium
Referee: John Doe
Date: 12/25/25
Time: 14:30
Max Participants: 16
Entry Fee (Optional): 25
Prize Pool (Optional): 500

These values will create a tournament scheduled for December 25, 2025 at 2:30 PM, with 16 participants, a referee named John Doe, an entry fee of 25, and a prize pool of 500.
*/

// --- Data Model (Updated) ---

data class TournamentDetails(
    val name: String = "",
    val stadium: String = "",
    val date: String = "",
    val time: String = "",
    val maxParticipants: String = "",
    val referee: String = "", // This should be an ID in production
    val entryFee: String = "",
    val prizePool: String = ""
)

// --- Screen Composable ---

@Composable
fun TournamentCreateForumScreen(
    navController: androidx.navigation.NavHostController,
    currentUserId: String // <-- Add this parameter for the authenticated user
) {
    // State to hold form data
    var details by remember { mutableStateOf(TournamentDetails()) }

    // Scroll state for the main content area
    val scrollState = rememberScrollState()
    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current

    // Check if the form is valid (now includes referee)
    val isFormValid = details.name.isNotBlank() &&
            details.stadium.isNotBlank() &&
            details.date.isNotBlank() &&
            details.time.isNotBlank() &&
            details.maxParticipants.isNotBlank() &&
            details.referee.isNotBlank() && // <-- NEW VALIDATION
            details.maxParticipants.all { it.isDigit() }

    MaterialTheme {
        Scaffold(
            // Bottom bar for fixed buttons
            bottomBar = {
                // Action Buttons (fixed at the bottom)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Back Button
                    OutlinedButton(
                        onClick = { /*TODO*/ },
                        modifier = Modifier.weight(1f),
                        contentPadding = PaddingValues(vertical = 14.dp),
                        shape = RoundedCornerShape(12.dp),
                        border = ButtonDefaults.outlinedButtonBorder(enabled = true)
                    ) {
                        Text("Back", color = MaterialTheme.colorScheme.onBackground)
                    }

                    // Create Tournament Button
                    Button(
                        onClick = {
                            coroutineScope.launch {
                                try {
                                    val maxParticipants = details.maxParticipants.toIntOrNull()
                                    val entryFee = details.entryFee.toIntOrNull()
                                    val prizePool = details.prizePool.toIntOrNull()
                                    val refereeList = listOf(details.referee) // Should be a list of IDs

                                    // Fix date parsing to match yyyy-MM-dd and HH:mm input
                                    val inputFormat = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())
                                    val outputFormat = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
                                    val dateTimeString = "${details.date} ${details.time}" // e.g. 2025-01-01 14:00
                                    val dateDebut: String = try {
                                        val parsedDate = inputFormat.parse(dateTimeString)!!
                                        outputFormat.format(parsedDate)
                                    } catch (e: Exception) {
                                        android.util.Log.e("TournamentCreate", "Date parsing error", e)
                                        ""
                                    }
                                    val dateFin = dateDebut

                                    if (maxParticipants == null || dateDebut.isEmpty()) {
                                        Toast.makeText(context, "Invalid input. Please check your entries.", Toast.LENGTH_SHORT).show()
                                        return@launch
                                    }

                                    val request = CreateCoupeRequest(
                                        nom = details.name,
                                        participants = emptyList(),
                                        dateDebut = dateDebut,
                                        dateFin = dateFin,
                                        tournamentName = details.name,
                                        stadium = details.stadium,
                                        date = details.date, // e.g. 12/25/25 or 2025-12-25
                                        time = details.time, // e.g. 14:30
                                        maxParticipants = maxParticipants,
                                        entryFee = entryFee,
                                        prizePool = prizePool,
                                        referee = refereeList,
                                        statut = "PROGRAMME"
                                    )

                                    // DEBUG: Log the JWT before making the API call
                                    val jwt = tn.esprit.dam.data.RetrofitClient.getJwtToken(context)
                                    android.util.Log.d("TournamentCreate", "JWT used for Authorization: $jwt")

                                    val api = RetrofitClient.getTournamentApiService(context)
                                    val response = api.createCoupe(request)
                                    if (response.isSuccessful) {
                                        Toast.makeText(context, "Tournament created successfully!", Toast.LENGTH_LONG).show()
                                        navController.popBackStack()
                                    } else {
                                        android.util.Log.e("TournamentCreate", "API error: ${response.code()} ${response.message()}")
                                        Toast.makeText(context, "Failed to create tournament.", Toast.LENGTH_LONG).show()
                                    }
                                } catch (e: Exception) {
                                    android.util.Log.e("TournamentCreate", "Exception: ${e.message}", e)
                                    Toast.makeText(context, "An error occurred.", Toast.LENGTH_LONG).show()
                                }
                            }
                        },
                        modifier = Modifier.weight(1f),
                        enabled = isFormValid, // Disabled if form is not valid
                        contentPadding = PaddingValues(vertical = 14.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = MaterialTheme.colorScheme.onPrimary,
                            disabledContainerColor = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.2f),
                            disabledContentColor = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                        )
                    ) {
                        Text("Create Tournament", fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        ) { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues) // Handle top/bottom bar insets
            ) {
                // Custom Header Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 16.dp, end = 24.dp, top = 16.dp, bottom = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Navigation Icon (Back Button)
                    IconButton(onClick = { /*TODO*/ }) {
                        Icon(
                            Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = MaterialTheme.colorScheme.onBackground
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp)) // Spacing between icon and title

                    // Title
                    Text(
                        text = "Create Tournament",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    )
                }

                // Main Content Column (Scrollable)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        // Apply scrolling here
                        .verticalScroll(scrollState)
                        .padding(horizontal = 24.dp)
                        .padding(bottom = 16.dp) // Add padding above the bottom bar
                ) {
                    // Progress Bar
                    ProgressIndicator(currentStep = 2, totalSteps = 2)
                    Spacer(modifier = Modifier.height(24.dp))

                    // Section Headers
                    Text(
                        text = "Tournament Details",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.SemiBold,
                    )
                    Text(
                        text = "Fill in the information below",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                    )
                    Spacer(modifier = Modifier.height(24.dp))

                    // Form Fields
                    Column(
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        // 1. Tournament Name
                        FormTextField(
                            label = "Tournament Name",
                            placeholder = "e.g., Champions League 2024",
                            value = details.name,
                            onValueChange = { details = details.copy(name = it) },
                            leadingIcon = Icons.Default.EmojiEvents
                        )

                        // 2. Stadium (Mock Dropdown)
                        FormTextField(
                            label = "Stadium",
                            placeholder = "Select a stadium...",
                            value = details.stadium,
                            onValueChange = { details = details.copy(stadium = it) },
                            leadingIcon = Icons.Default.LocationOn,
                            trailingIcon = Icons.Default.KeyboardArrowDown
                        )

                        // 3. Referee (Mock Dropdown) - NEW FIELD
                        FormTextField(
                            label = "Referee",
                            placeholder = "Select a referee...",
                            value = details.referee,
                            onValueChange = { details = details.copy(referee = it) },
                            leadingIcon = Icons.Default.Person, // Changed icon for referee
                            trailingIcon = Icons.Default.KeyboardArrowDown
                        )

                        // 4. Date and Time Row
                        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            // Date
                            FormTextField(
                                label = "Date",
                                placeholder = "mm/dd/yy",
                                value = details.date,
                                onValueChange = { details = details.copy(date = it) },
                                leadingIcon = Icons.Default.CalendarToday,
                                modifier = Modifier.weight(1f),
                                keyboardType = KeyboardType.Number
                            )
                            // Time
                            FormTextField(
                                label = "Time",
                                placeholder = "--:-- --",
                                value = details.time,
                                onValueChange = { details = details.copy(time = it) },
                                leadingIcon = Icons.Default.Schedule,
                                modifier = Modifier.weight(1f)
                            )
                        }

                        // 5. Max Participants
                        FormTextField(
                            label = "Max Participants",
                            placeholder = "e.g., 16",
                            value = details.maxParticipants,
                            onValueChange = { details = details.copy(maxParticipants = it) },
                            leadingIcon = Icons.Default.Group,
                            keyboardType = KeyboardType.Number
                        )

                        // 6. Entry Fee (Optional)
                        FormTextField(
                            label = "Entry Fee (Optional)",
                            placeholder = "e.g., \$25",
                            value = details.entryFee,
                            onValueChange = { details = details.copy(entryFee = it) },
                            leadingIcon = Icons.Default.AttachMoney,
                            keyboardType = KeyboardType.Number
                        )

                        // 7. Prize Pool (Optional)
                        FormTextField(
                            label = "Prize Pool (Optional)",
                            placeholder = "e.g., \$500",
                            value = details.prizePool,
                            onValueChange = { details = details.copy(prizePool = it) },
                            leadingIcon = Icons.Default.EmojiEvents,
                            keyboardType = KeyboardType.Number
                        )
                    }
                    // A small spacer at the very bottom of the scrollable content
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}

// --- Reusable Components (Unchanged) ---

@Composable
fun ProgressIndicator(currentStep: Int, totalSteps: Int, modifier: Modifier = Modifier) {
    val progress = currentStep.toFloat() / totalSteps.toFloat()
    Column(modifier = modifier) {
        Text(
            text = "Step $currentStep of $totalSteps",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
        )
        Spacer(modifier = Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp)),
            color = MaterialTheme.colorScheme.primary,
            trackColor = MaterialTheme.colorScheme.surface
        )
    }
}

@Composable
fun FormTextField(
    label: String,
    placeholder: String,
    value: String,
    onValueChange: (String) -> Unit,
    leadingIcon: ImageVector,
    modifier: Modifier = Modifier,
    trailingIcon: ImageVector? = null,
    keyboardType: KeyboardType = KeyboardType.Text
) {
    Column(modifier = modifier) {
        Text(
            text = label,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onBackground
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder) },
            leadingIcon = {
                Icon(
                    leadingIcon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            },
            trailingIcon = if (trailingIcon != null) {
                {
                    Icon(
                        trailingIcon,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
            } else null,
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                cursorColor = MaterialTheme.colorScheme.primary,
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface
            )
        )
    }
}

// --- Previews (Updated to use DAMTheme) ---

@Preview(showBackground = true, name = "Light Theme")
@Composable
fun TournamentCreateForumScreenPreviewLight() {
    DAMTheme(darkTheme = false) {
        TournamentCreateForumScreen(
            navController = androidx.navigation.compose.rememberNavController(),
            currentUserId = "PREVIEW_USER_ID"
        )
    }
}

@Preview(showBackground = true, name = "Dark Theme")
@Composable
fun TournamentCreateForumScreenPreviewDark() {
    DAMTheme(darkTheme = true) {
        TournamentCreateForumScreen(
            navController = androidx.navigation.compose.rememberNavController(),
            currentUserId = "PREVIEW_USER_ID"
        )
    }
}