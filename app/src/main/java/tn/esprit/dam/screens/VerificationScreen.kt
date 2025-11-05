package tn.esprit.dam.screens

import android.os.CountDownTimer
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VerificationScreen(navController: NavController) {
    // Constants
    val codeLength = 6

    // State for the 6-digit OTP code
    var otpCode by remember { mutableStateOf(List(codeLength) { "" }) }

    // State for the resend timer
    var timeLeft by remember { mutableStateOf(30) }
    var timerRunning by remember { mutableStateOf(false) }

    // Focus Management
    val focusRequesters = remember { List(codeLength) { FocusRequester() } }
    val focusManager = LocalFocusManager.current

    // Snackbar Host State for displaying messages
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    // Colors
    val primaryGreen = Color(0xFF4CAF50)
    val inputBackground = Color(0xFFF5F5F5)
    val textColor = Color.Black
    val grayColor = Color.Gray

    // Countdown Timer logic
    LaunchedEffect(timerRunning) {
        if (timerRunning) {
            val timer = object : CountDownTimer(timeLeft * 1000L, 1000L) {
                override fun onTick(millisUntilFinished: Long) {
                    timeLeft = (millisUntilFinished / 1000).toInt()
                }

                override fun onFinish() {
                    timeLeft = 0
                    timerRunning = false
                }
            }
            timer.start()
        }
    }

    // Start timer and set initial focus automatically
    LaunchedEffect(Unit) {
        timerRunning = true
        focusRequesters.first().requestFocus()
    }

    // --- SCaffold added to host the Snackbar ---
    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
                .padding(24.dp)
                .padding(paddingValues)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start,
                verticalArrangement = Arrangement.Top
            ) {
                Spacer(modifier = Modifier.height(60.dp))

                Text(
                    text = "Almost there",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    color = textColor,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                val annotatedDescription = buildAnnotatedString {
                    withStyle(style = SpanStyle(color = grayColor, fontSize = 16.sp)) {
                        append("Please enter the 6-digit code sent to your\nemail ")
                    }
                    withStyle(style = SpanStyle(color = primaryGreen, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)) {
                        append("contact.uiuxexperts@gmail.com")
                    }
                    withStyle(style = SpanStyle(color = grayColor, fontSize = 16.sp)) {
                        append(" for\nverification.")
                    }
                }
                Text(
                    text = annotatedDescription,
                    modifier = Modifier.padding(bottom = 40.dp)
                )

                // OTP Code Input Fields
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    otpCode.forEachIndexed { index, digit ->
                        BasicTextField(
                            value = digit,
                            onValueChange = { newValue ->
                                // 1. Handle deletion (Back key with empty field)
                                if (newValue.isEmpty() && digit.isEmpty() && index > 0) {
                                    val newOtpCode = otpCode.toMutableList()
                                    newOtpCode[index - 1] = ""
                                    otpCode = newOtpCode
                                    focusRequesters[index - 1].requestFocus()
                                }
                                // 2. Handle insertion (Digit input)
                                else if (newValue.length <= 1 && newValue.all { it.isDigit() }) {
                                    val newOtpCode = otpCode.toMutableList()
                                    newOtpCode[index] = newValue
                                    otpCode = newOtpCode

                                    if (newValue.isNotEmpty() && index < codeLength - 1) {
                                        focusRequesters[index + 1].requestFocus()
                                    } else if (index == codeLength - 1 && newValue.isNotEmpty()) {
                                        focusManager.clearFocus()
                                    }
                                }
                            },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true,
                            modifier = Modifier
                                .size(50.dp)
                                .focusRequester(focusRequesters[index])
                                .background(inputBackground, RoundedCornerShape(12.dp))
                                .clip(RoundedCornerShape(12.dp))
                                .wrapContentHeight(Alignment.CenterVertically)
                                .padding(top = 10.dp, bottom = 10.dp),
                            textStyle = MaterialTheme.typography.headlineSmall.copy(
                                color = textColor,
                                fontWeight = FontWeight.Bold,
                                fontSize = 20.sp,
                                textAlign = TextAlign.Center
                            ),
                            decorationBox = { innerTextField ->
                                Box(
                                    contentAlignment = Alignment.Center,
                                    modifier = Modifier.fillMaxSize()
                                ) {
                                    innerTextField()
                                }
                            }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(40.dp))

                // Verify Button
                Button(
                    onClick = {
                        val fullCode = otpCode.joinToString("")
                        if (fullCode.length == codeLength && fullCode.all { it.isDigit() }) {
                            scope.launch {
                                // 1. Show Success Snackbar
                                snackbarHostState.showSnackbar(
                                    message = "Verification successful!",
                                    withDismissAction = true,
                                    duration = SnackbarDuration.Short
                                )
                                // 2. Delay for 0.6 seconds
                                delay(600)

                                // 3. Navigate
                                navController.navigate("LoginScreen") {
                                    popUpTo(navController.graph.startDestinationId) { inclusive = true }
                                }
                            }
                        } else {
                            // Show error Snackbar if code is incomplete/invalid
                            scope.launch {
                                snackbarHostState.showSnackbar(
                                    message = "Please enter the complete 6-digit code.",
                                    withDismissAction = true,
                                    duration = SnackbarDuration.Short
                                )
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = primaryGreen
                    ),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
                ) {
                    Text(
                        text = "Verify",
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Resend Code Section
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    TextButton(
                        onClick = {
                            if (!timerRunning) {
                                scope.launch {
                                    snackbarHostState.showSnackbar(
                                        message = "Verification code resent!",
                                        withDismissAction = true,
                                        duration = SnackbarDuration.Short
                                    )
                                }
                                // Restart timer and reset focus
                                timeLeft = 30
                                timerRunning = true
                                otpCode = List(codeLength) { "" } // Clear input fields
                                focusRequesters.first().requestFocus()
                            }
                        },
                        enabled = !timerRunning
                    ) {
                        Text(
                            text = "Didn't receive any code? Resend Again",
                            color = if (timerRunning) grayColor else primaryGreen,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    Text(
                        text = "Request a new code in ${String.format("%02d", timeLeft)}s",
                        color = grayColor,
                        fontSize = 12.sp
                    )
                }
            }

            // Back Button (Bottom-left aligned)
            IconButton(
                // --- MODIFIED: Navigate explicitly to "SignupScreen" ---
                onClick = { navController.navigate("SignupScreen") },
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(bottom = 24.dp)
                    .size(56.dp)
                    .clip(CircleShape)
                    .background(Color.Black)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back to Signup",
                    tint = Color.White
                )
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 360, heightDp = 720)
@Composable
fun VerificationScreenPreview() {
    VerificationScreen(navController = rememberNavController())
}