package tn.esprit.dam

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import tn.esprit.dam.screens.HomeScreen
import tn.esprit.dam.screens.LoginScreen
import tn.esprit.dam.screens.SignupScreen
import tn.esprit.dam.screens.SplashScreen
import tn.esprit.dam.screens.VerificationScreen
import tn.esprit.dam.screens.WelcomeScreen1
import tn.esprit.dam.screens.WelcomeScreen2
import tn.esprit.dam.screens.WelcomeScreen3
import tn.esprit.dam.ui.theme.DAMTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            DAMTheme {
                val navController = rememberNavController()

                // Define the NavHost for navigation
                NavHost(
                    navController = navController,
                    startDestination = "splash" // Start with splash screen
                ) {
                    composable("splash") {
                        SplashScreen(navController = navController)
                    }
                    composable("welcome_screen_1") {
                        WelcomeScreen1(navController = navController) // Navigate to WelcomeScreen1
                    }
                    composable("welcome_screen_2") {
                        WelcomeScreen2(navController = navController) // Navigate to WelcomeScreen2
                    }
                    composable("welcome_screen_3") {
                        WelcomeScreen3(navController = navController) // Navigate to WelcomeScreen3
                    }
                    composable("LoginScreen") {
                        LoginScreen(navController = navController) // Navigate to WelcomeScreen3
                    }
                    composable("SignUpScreen") {
                        SignupScreen(navController = navController) // Navigate to WelcomeScreen3
                    }
                    composable("VerificationScreen") {
                        VerificationScreen(navController = navController) // Navigate to WelcomeScreen3
                    }
                    composable("HomeScreen") {
                        HomeScreen(navController = navController) // Navigate to WelcomeScreen3
                    }
                    // You can add more screens here if needed
                }
            }
        }
    }
}
