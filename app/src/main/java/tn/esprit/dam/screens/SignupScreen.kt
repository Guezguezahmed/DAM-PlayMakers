package tn.esprit.dam.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import tn.esprit.dam.R
import java.util.regex.Pattern

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignupScreen(navController: NavController) {
    // State for input fields
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phoneNumber by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var agreedToTerms by remember { mutableStateOf(false) }

    // State for validation errors
    var fullNameError by remember { mutableStateOf<String?>(null) }
    var emailError by remember { mutableStateOf<String?>(null) }
    var phoneError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }
    var termsError by remember { mutableStateOf<String?>(null) } // Used for visual error check

    // Snackbar Host State for displaying messages
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    // Scroll State for fixing the layout overflow issue
    val scrollState = rememberScrollState()

    // Colors
    val primaryGreen = Color(0xFF4CAF50)
    val inputBackground = Color(0xFFF5F5F5)
    val textColor = Color.Black
    val grayColor = Color.Gray
    val errorColor = Color.Red

    // --- Validation Functions ---
    val emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")
    val passwordPattern = Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$")

    fun validateInputs(): Boolean {
        var isValid = true

        // Reset all errors first
        fullNameError = null
        emailError = null
        phoneError = null
        passwordError = null
        termsError = null // Resetting terms error too

        // Checks
        if (fullName.trim().length < 6) { fullNameError = "Full name must be at least 6 characters."; isValid = false }
        if (!emailPattern.matcher(email).matches()) { emailError = "Invalid email format."; isValid = false }
        if (!phoneNumber.matches(Regex("^\\d{8}$"))) { phoneError = "Phone number must be exactly 8 digits."; isValid = false }
        if (!passwordPattern.matcher(password).matches()) { passwordError = "Password must be stronger."; isValid = false }

        // Terms Check - Sets termsError for visual change if unchecked
        if (!agreedToTerms) {
            termsError = "Unchecked" // Setting a value here to trigger the red color
            isValid = false
        }

        return isValid
    }

    // ------------------------------------

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        content = { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFEFEFEF))
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp))
                        .background(Color.White)
                        .padding(horizontal = 24.dp)
                        .padding(paddingValues)
                        .verticalScroll(scrollState),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {

                    // --- 1. Illustration and Header ---
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 0.dp, bottom = 32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.login_illustration),
                            contentDescription = "Registration Illustration",
                            modifier = Modifier.size(150.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Get Started",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = textColor
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
                                text = "by creating a free account.",
                                fontSize = 14.sp,
                                color = grayColor
                            )
                        }
                    }

                    // --- 2. Input Fields with Error Display (No change here) ---

                    // Full Name Input
                    TextField(
                        value = fullName, onValueChange = { fullName = it; fullNameError = null },
                        modifier = Modifier.fillMaxWidth(), placeholder = { Text("Full name") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text), singleLine = true, isError = fullNameError != null,
                        colors = TextFieldDefaults.colors(focusedIndicatorColor = Color.Transparent, unfocusedIndicatorColor = Color.Transparent, disabledIndicatorColor = Color.Transparent, focusedContainerColor = inputBackground, unfocusedContainerColor = inputBackground, disabledContainerColor = inputBackground, cursorColor = primaryGreen),
                        shape = RoundedCornerShape(12.dp),
                        trailingIcon = { Icon(imageVector = Icons.Default.Person, contentDescription = "Person Icon", tint = if (fullNameError != null) errorColor else grayColor) }
                    )
                    if (fullNameError != null) { Text(fullNameError!!, color = errorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth()) }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Valid Email Input
                    TextField(
                        value = email, onValueChange = { email = it; emailError = null },
                        modifier = Modifier.fillMaxWidth(), placeholder = { Text("Valid email") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email), singleLine = true, isError = emailError != null,
                        colors = TextFieldDefaults.colors(focusedIndicatorColor = Color.Transparent, unfocusedIndicatorColor = Color.Transparent, disabledIndicatorColor = Color.Transparent, focusedContainerColor = inputBackground, unfocusedContainerColor = inputBackground, disabledContainerColor = inputBackground, cursorColor = primaryGreen),
                        shape = RoundedCornerShape(12.dp),
                        trailingIcon = { Icon(imageVector = Icons.Default.Email, contentDescription = "Email Icon", tint = if (emailError != null) errorColor else grayColor) }
                    )
                    if (emailError != null) { Text(emailError!!, color = errorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth()) }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Phone Number Input
                    TextField(
                        value = phoneNumber, onValueChange = { if (it.length <= 8 && it.all { char -> char.isDigit() }) { phoneNumber = it; phoneError = null } },
                        modifier = Modifier.fillMaxWidth(), placeholder = { Text("Phone number") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone), singleLine = true, isError = phoneError != null,
                        colors = TextFieldDefaults.colors(focusedIndicatorColor = Color.Transparent, unfocusedIndicatorColor = Color.Transparent, disabledIndicatorColor = Color.Transparent, focusedContainerColor = inputBackground, unfocusedContainerColor = inputBackground, disabledContainerColor = inputBackground, cursorColor = primaryGreen),
                        shape = RoundedCornerShape(12.dp),
                        trailingIcon = { Icon(imageVector = Icons.Default.Phone, contentDescription = "Phone Icon", tint = if (phoneError != null) errorColor else grayColor) }
                    )
                    if (phoneError != null) { Text(phoneError!!, color = errorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth()) }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Strong Password Input
                    TextField(
                        value = password, onValueChange = { password = it; passwordError = null },
                        modifier = Modifier.fillMaxWidth(), placeholder = { Text("Strong password") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password), singleLine = true, isError = passwordError != null,
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        colors = TextFieldDefaults.colors(focusedIndicatorColor = Color.Transparent, unfocusedIndicatorColor = Color.Transparent, disabledIndicatorColor = Color.Transparent, focusedContainerColor = inputBackground, unfocusedContainerColor = inputBackground, disabledContainerColor = inputBackground, cursorColor = primaryGreen),
                        shape = RoundedCornerShape(12.dp),
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff, contentDescription = if (passwordVisible) "Hide password" else "Show password", tint = if (passwordError != null) errorColor else grayColor)
                            }
                        }
                    )
                    if (passwordError != null) { Text(passwordError!!, color = errorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth()) }
                    Spacer(modifier = Modifier.height(10.dp))

                    // --- 3. Terms and Conditions Checkbox (Modified) ---
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = agreedToTerms,
                                onCheckedChange = { agreedToTerms = it; termsError = null }, // Clear error on change
                                colors = CheckboxDefaults.colors(
                                    checkedColor = primaryGreen,
                                    // Condition to make the checkbox border red if there is a validation error
                                    uncheckedColor = if (termsError != null) errorColor else grayColor
                                ),
                                modifier = Modifier.size(20.dp)
                            )
                            val termsText = buildAnnotatedString {
                                withStyle(style = SpanStyle(color = textColor, fontSize = 12.sp)) { append("By checking the box you agree to our ") }
                                withStyle(style = SpanStyle(color = primaryGreen, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)) { append("Terms") }
                                withStyle(style = SpanStyle(color = textColor, fontSize = 12.sp)) { append(" and ") }
                                withStyle(style = SpanStyle(color = primaryGreen, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)) { append("Conditions") }
                            }
                            Text(text = termsText, modifier = Modifier.padding(start = 8.dp))
                        }
                        // Explicit red error message is removed here, as requested.
                    }

                    Spacer(modifier = Modifier.height(40.dp))

                    // --- 4. Next Button ---
                    Button(
                        onClick = {
                            if (validateInputs()) {
                                scope.launch {
                                    delay(50)
                                    navController.navigate("VerificationScreen") {
                                        popUpTo(navController.graph.startDestinationId) { inclusive = true }
                                    }
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
                        Text(text = "Next", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(painter = painterResource(id = R.drawable.arrow_icon), contentDescription = "Next", tint = Color.White)
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // --- 5. Already a member? Login in ---
                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Already a member? ", color = textColor, fontSize = 14.sp)
                        TextButton(onClick = { navController.navigate("loginScreen") }) {
                            Text(text = "Login in", color = primaryGreen, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                        }
                    }

                    Spacer(modifier = Modifier.height(30.dp))
                }
            }
        }
    )
}

@Preview(showBackground = true, widthDp = 360, heightDp = 720)
@Composable
fun SignupScreenPreview() {
    SignupScreen(navController = rememberNavController())
}