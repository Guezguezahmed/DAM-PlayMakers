package tn.esprit.dam.screens

import androidx.compose.foundation.clickable
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.foundation.background
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import tn.esprit.dam.R // Ensure this R is correctly pointing to your resources

// Define colors based on the screenshot
val PrimaryDark = Color(0xFF000000)
val PrimaryGreen = Color(0xFF4CAF50)
val TextYellow = Color(0xFFFDD835) // Used for 'Arena Sports' and gold accents
val CardGray = Color(0xFF333333)    // Dark gray for cards
val DarkTextColor = Color.White
val LightGrayText = Color(0xFFCCCCCC)

@Composable
fun HomeScreen(navController: NavController) {
    Scaffold(
        modifier = Modifier.fillMaxSize().background(PrimaryDark),
        containerColor = PrimaryDark, // Set Scaffold background to Black
        bottomBar = { ArenaSportsBottomBar(navController) }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(PrimaryDark)
                .padding(horizontal = 20.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item { HeaderSection() }
            item { QuickMatchAndTournamentSection() }
            item { UpcomingEventsHeader() }
            item { EventCard("Tournois Basket", "15 sep | 18:00", "Esprit Stadium") }
            item { EventCard("Tournois Basket", "17 sep | 14:00", "Esprit Indoor Court") }
            // You can add more events here if needed
        }
    }
}

// --- Composable Sections ---

@Composable
fun HeaderSection() {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Arena Sports",
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            color = TextYellow,
            // Custom font may be needed here to match the exact style
        )
        Text(
            text = "The way to go",
            fontSize = 18.sp,
            fontWeight = FontWeight.Medium,
            color = DarkTextColor,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        StatsCard()
    }
}

@Composable
fun StatsCard() {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardGray),
        modifier = Modifier
            .fillMaxWidth()
            .height(70.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Gold Badge Icon (Placeholder)
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFFFD700).copy(alpha = 0.5f)) // Translucent Gold
                    .padding(4.dp),
                contentAlignment = Alignment.Center
            ) {
                // Placeholder for the custom gold badge icon (R.drawable.gold_badge)
                Text("🏆", fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = "Wins : 10 | Losses :3",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                color = DarkTextColor
            )
            Spacer(modifier = Modifier.weight(1f))
            Text(
                text = "Winrate : 76%",
                fontSize = 16.sp,
                color = DarkTextColor
            )
        }
    }
}

@Composable
fun QuickMatchAndTournamentSection() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Quick Match Card
        CustomActionButton(
            label = "Quick Match",
            iconId = R.drawable.trophy, // Placeholder for lightning icon
            modifier = Modifier.weight(1f),
            backgroundColor = CardGray
        )

        // Join Tournament Card (Custom Image/Layout)
        CustomActionButton(
            label = "Join Tournament",
            iconId = R.drawable.trophy, // Placeholder for trophy icon
            modifier = Modifier.weight(1f),
            backgroundColor = CardGray
        )
    }
}

@Composable
fun CustomActionButton(
    label: String,
    iconId: Int,
    modifier: Modifier = Modifier,
    backgroundColor: Color
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        modifier = modifier.height(130.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Icon/Image (Assuming large custom image assets)
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .clip(RoundedCornerShape(8.dp))
            ) {
                // Placeholder for custom image (e.g., R.drawable.quick_match_image)
                Text("⚡", fontSize = 40.sp, modifier = Modifier.align(Alignment.Center))
            }
            Text(
                text = label,
                color = DarkTextColor,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}


@Composable
fun UpcomingEventsHeader() {
    Text(
        text = "Upcoming Events",
        fontSize = 22.sp,
        fontWeight = FontWeight.Bold,
        color = DarkTextColor,
        modifier = Modifier.padding(top = 8.dp)
    )
}

@Composable
fun EventCard(
    title: String,
    time: String,
    location: String
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardGray),
        modifier = Modifier
            .fillMaxWidth()
            .height(130.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Background Image/Overlay (Placeholder for the stadium image)
            // You might need a stadium image resource here
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.4f)) // Dark overlay for text readability
            )

            // Content Column
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Title and Participants (Top Row)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column {
                        Text(title, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = DarkTextColor)
                        Text(time, fontSize = 14.sp, color = LightGrayText)
                    }
                    // Participants Circle
                    Box(
                        modifier = Modifier
                            .size(50.dp)
                            .clip(RoundedCornerShape(25.dp))
                            .background(Color.Gray.copy(alpha = 0.5f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("16/32\nParticiants", textAlign = TextAlign.Center, fontSize = 10.sp, color = DarkTextColor, fontWeight = FontWeight.Bold)
                    }
                }

                // Location and Buttons (Bottom Row)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(location, fontSize = 14.sp, color = LightGrayText)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = { /* Handle Join Solo */ },
                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryGreen),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            modifier = Modifier.height(30.dp)
                        ) {
                            Text("Join Solo", fontSize = 12.sp, color = DarkTextColor)
                        }
                        Button(
                            onClick = { /* Handle Join With Team */ },
                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryGreen),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            modifier = Modifier.height(30.dp)
                        ) {
                            Text("Join With Team", fontSize = 12.sp, color = DarkTextColor)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ArenaSportsBottomBar(navController: NavController) {
    BottomAppBar(
        containerColor = Color(0xFF1A1A1A), // Slightly lighter black/dark gray for the bar
        modifier = Modifier.height(60.dp)
    ) {
        // Navigation items (Icons are placeholders)
        BottomBarItem(navController, "Home", R.drawable.arrow_icon, "home", isSelected = true)
        BottomBarItem(navController, "Leaderboard", R.drawable.arrow_icon, "leaderboard")
        BottomBarItem(navController, "Events", R.drawable.arrow_icon, "events")
        BottomBarItem(navController, "Profile", R.drawable.arrow_icon, "profile")
        BottomBarItem(navController, "Friends", R.drawable.arrow_icon, "friends")
    }
}

@Composable
fun RowScope.BottomBarItem(
    navController: NavController,
    label: String,
    iconId: Int,
    route: String,
    isSelected: Boolean = false
) {
    val color = if (isSelected) TextYellow else Color.White

    Column(
        modifier = Modifier
            .weight(1f)
            .fillMaxHeight()
            .clickable { navController.navigate(route) },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            // Placeholder for custom icons (R.drawable.ic_home, etc.)
            painter = painterResource(id = iconId),
            contentDescription = label,
            tint = color,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            fontSize = 10.sp,
            color = color,
            fontWeight = FontWeight.Medium
        )
    }
}


@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    HomeScreen(navController = rememberNavController())
}