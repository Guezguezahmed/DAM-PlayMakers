package tn.esprit.dam.screens

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import tn.esprit.dam.R
import tn.esprit.dam.ui.theme.AppTheme // IMPORTANT: Import the theme

// Public function called by MainActivity
@Composable
fun LoginScreen(navController: NavController) {
    LoginScreenWrapper(navController)
}

// --- Wrapper to hold local state and apply AppTheme locally ---
@Composable
fun LoginScreenWrapper(navController: NavController) {
    // LOCAL STATE: The theme state is kept here
    var isDarkTheme by remember { mutableStateOf(false) }

    // LOCAL THEME WRAPPER: AppTheme is applied only to the LoginScreen content.
    AppTheme(isDarkTheme = isDarkTheme) {
        LoginScreenContent(
            navController = navController,
            isDarkTheme = isDarkTheme,
            onThemeToggle = { isDarkTheme = it }
        )
    }
}


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreenContent(
    navController: NavController,
    isDarkTheme: Boolean,
    onThemeToggle: (Boolean) -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rememberMe by remember { mutableStateOf(false) }
    var passwordVisible by remember { mutableStateOf(false) }

    // --- USE GLOBAL COLORS VIA APP THEME ---
    val colors = AppTheme.colors // Accesses the animated colors from AppTheme
    val primaryGreen = colors.primaryGreen

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background) // Use global theme background color
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .clip(RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp))
                .background(colors.cardBackground) // Use global theme card background color
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            // Header + Illustration
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 40.dp, bottom = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Image(
                    painter = painterResource(id = R.drawable.login_illustration),
                    contentDescription = "Login Illustration",
                    modifier = Modifier.size(150.dp)
                )

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = "Welcome back",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary // Use theme primary text color
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(primaryGreen)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "sign in to access your account",
                        fontSize = 14.sp,
                        color = colors.textSecondary // Use theme secondary color
                    )
                }
            }

            // Email
            TextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Enter your email", color = colors.textSecondary.copy(alpha = 0.7f)) },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email,
                    imeAction = ImeAction.Next
                ),
                singleLine = true,
                colors = TextFieldDefaults.colors(
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    disabledIndicatorColor = Color.Transparent,
                    focusedContainerColor = colors.inputBackground, // Use theme input background
                    unfocusedContainerColor = colors.inputBackground,
                    disabledContainerColor = colors.inputBackground,
                    cursorColor = primaryGreen,
                    focusedTextColor = colors.textPrimary,
                    unfocusedTextColor = colors.textPrimary,
                ),
                shape = RoundedCornerShape(12.dp),
                trailingIcon = {
                    Icon(
                        imageVector = Icons.Filled.Email,
                        contentDescription = "Email Icon",
                        tint = colors.textSecondary // Use theme secondary color
                    )
                }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Password
            TextField(
                value = password,
                onValueChange = { password = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Password", color = colors.textSecondary.copy(alpha = 0.7f)) },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Done
                ),
                singleLine = true,
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                colors = TextFieldDefaults.colors(
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    disabledIndicatorColor = Color.Transparent,
                    focusedContainerColor = colors.inputBackground, // Use theme input background
                    unfocusedContainerColor = colors.inputBackground,
                    disabledContainerColor = colors.inputBackground,
                    cursorColor = primaryGreen,
                    focusedTextColor = colors.textPrimary,
                    unfocusedTextColor = colors.textPrimary,
                ),
                shape = RoundedCornerShape(12.dp),
                trailingIcon = {
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            imageVector = if (passwordVisible) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                            contentDescription = if (passwordVisible) "Hide password" else "Show password",
                            tint = colors.textSecondary // Use theme secondary color
                        )
                    }
                }
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Remember me + Forgot password
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(
                        checked = rememberMe,
                        onCheckedChange = { rememberMe = it },
                        colors = CheckboxDefaults.colors(
                            checkedColor = primaryGreen,
                            uncheckedColor = colors.textSecondary // Use theme secondary color
                        ),
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "Remember me",
                        fontSize = 12.sp,
                        color = colors.textSecondary, // Use theme secondary color
                        modifier = Modifier.padding(start = 4.dp)
                    )
                }
                TextButton(onClick = { navController.navigate("forgot_password") }) {
                    Text(
                        text = "Forgot password?",
                        color = primaryGreen,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(40.dp))

            // Next button
            Button(
                onClick = { navController.navigate("HomeScreen") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = primaryGreen),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
            ) {
                Text(
                    text = "Next",
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = "Next",
                    tint = Color.White
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Register
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "New member ? ", color = colors.textPrimary, fontSize = 14.sp) // Use theme primary color
                TextButton(onClick = { navController.navigate("SignupScreen") }) {
                    Text(
                        text = "Register now",
                        color = primaryGreen,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(60.dp))
        }

        // --- Dark Mode Toggle Button (Top Right) ---
        DayNightSwitch(
            isDarkTheme = isDarkTheme,
            onToggle = onThemeToggle, // Uses the state setter from LoginScreenWrapper
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 24.dp, end = 24.dp)
        )
    }
}

// --- Custom Day/Night Switch Composable (KEPT AS IS) ---
@Composable
fun DayNightSwitch(
    isDarkTheme: Boolean,
    onToggle: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    switchWidth: Dp = 100.dp,
    switchHeight: Dp = 50.dp,
    thumbSize: Dp = 40.dp
) {
    // Animate the horizontal offset of the thumb
    val thumbOffset by animateDpAsState(
        if (isDarkTheme) (switchWidth - thumbSize - 5.dp) else 5.dp,
        animationSpec = tween(300)
    )

    Box(
        modifier = modifier
            .width(switchWidth)
            .height(switchHeight)
            .clip(RoundedCornerShape(switchHeight / 2))
            .background(Color.Transparent)
            .clickable { onToggle(!isDarkTheme) },
        contentAlignment = Alignment.CenterStart
    ) {
        // Background image based on theme
        Image(
            painter = painterResource(
                id = if (isDarkTheme) R.drawable.night_background_switch else R.drawable.day_background_switch
            ),
            contentDescription = "Theme switch background",
            modifier = Modifier.fillMaxSize()
        )

        // Draggable thumb
        Box(
            modifier = Modifier
                .offset(x = thumbOffset)
                .size(thumbSize)
                .clip(CircleShape)
                .background(Color.White)
        )
    }
}


@Preview(showBackground = true, widthDp = 360, heightDp = 720)
@Composable
fun LoginScreenPreview() {
    // Call the wrapper to provide the necessary AppTheme context for preview
    LoginScreenWrapper(navController = rememberNavController())
}