package tn.esprit.dam.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavController
import kotlinx.coroutines.delay
import androidx.compose.ui.layout.ContentScale
import androidx.navigation.compose.rememberNavController
import tn.esprit.dam.R

@Composable
fun SplashScreen(navController: NavController) {
    Box(
        modifier = Modifier
            .fillMaxSize(), // Make sure the Box takes up the full screen

        contentAlignment = Alignment.Center
    ) {
        // Ensure the image fills the entire screen
        Image(
            painter = painterResource(id = R.drawable.splash_page), // Use your image resource
            contentDescription = "Splash Logo",
            modifier = Modifier.fillMaxSize(), // Fill the screen with the image
            contentScale = ContentScale.FillBounds // Stretch to fill the screen
        )
    }

    // Navigate after 1.5 seconds
    LaunchedEffect(Unit) {
        delay(1500) // 1.5 second delay
        navController.navigate("welcome_screen_1") {
            popUpTo("splash") { inclusive = true } // Remove splash screen from backstack
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SplashScreenPreview() {
    SplashScreen(navController = rememberNavController())
}
