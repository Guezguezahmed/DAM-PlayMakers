import SwiftUI

struct LoginView: View {
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var rememberMe: Bool = false
    @State private var isPasswordVisible: Bool = false
    @State private var showAlert: Bool = false
    @State private var alertMessage: String = ""

    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()

            VStack(spacing: 20) {
                Spacer(minLength: 60)

                // Illustration
                Image("login_illustration")
                    .resizable()
                    .scaledToFit()
                    .frame(height: 120)
                    .padding(.top, 40)

                // Title
                Text("Welcome back")
                    .font(.title)
                    .fontWeight(.bold)

                HStack(spacing: 6) {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 8, height: 8)
                    Text("sign in to access your account")
                        .foregroundColor(.gray)
                        .font(.subheadline)
                }

                // Email field
                VStack(alignment: .leading, spacing: 5) {
                    HStack {
                        TextField("Enter your email", text: $email)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(8)

                        Image(systemName: "envelope")
                            .foregroundColor(.gray)
                            .padding(.trailing, 8)
                    }
                    .padding(.horizontal)

                    if !email.isEmpty && !isValidEmail(email) {
                        Text("⚠️ Invalid email format")
                            .foregroundColor(.red)
                            .font(.caption)
                            .padding(.leading, 30)
                    }
                }

                // Password field
                VStack(alignment: .leading, spacing: 5) {
                    HStack {
                        if isPasswordVisible {
                            TextField("Password", text: $password)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                        } else {
                            SecureField("Password", text: $password)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                        }

                        Button(action: {
                            isPasswordVisible.toggle()
                        }) {
                            Image(systemName: isPasswordVisible ? "eye.slash" : "eye")
                                .foregroundColor(.gray)
                        }
                        .padding(.trailing, 8)
                    }
                    .padding(.horizontal)

                    if !password.isEmpty && password.count <= 6 {
                        Text("⚠️ Password must be longer than 6 characters")
                            .foregroundColor(.red)
                            .font(.caption)
                            .padding(.leading, 30)
                    }
                }

                // Remember me + Forgot password
                HStack {
                    Toggle("", isOn: $rememberMe)
                        .labelsHidden()
                        .toggleStyle(CheckboxToggleStyle())

                    Text("Remember me")
                        .foregroundColor(.gray)
                        .font(.subheadline)

                    Spacer()

                    Button(action: {
                        // forgot password action
                    }) {
                        Text("Forgot password?")
                            .foregroundColor(.green)
                            .font(.subheadline)
                    }
                }
                .padding(.horizontal, 24)

                // Next button
                Button(action: {
                    if validateFields() {
                        // 👉 Login action success
                        print("Login successful ✅")
                    } else {
                        showAlert = true
                    }
                }) {
                    HStack {
                        Text("Next")
                            .foregroundColor(.white)
                            .fontWeight(.semibold)
                        Image(systemName: "arrow.right")
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .cornerRadius(10)
                    .padding(.horizontal, 24)
                }
                .padding(.top, 10)
                .alert(isPresented: $showAlert) {
                    Alert(title: Text("Invalid Input"),
                          message: Text(alertMessage),
                          dismissButton: .default(Text("OK")))
                }

                Spacer()

                // Register
                HStack(spacing: 4) {
                    Text("New member ?")
                        .foregroundColor(.black)
                    NavigationLink(destination: RegisterView()
                        .navigationBarBackButtonHidden(true)) {
                        Text("Register now")
                            .foregroundColor(.green)
                    }
                }
                .padding(.bottom, 30)
            }
        }
        .navigationBarHidden(true)
        .navigationBarBackButtonHidden(true)
    }

    // MARK: - Validation Functions
    func validateFields() -> Bool {
        if email.isEmpty || password.isEmpty {
            alertMessage = "Please fill in all fields."
            return false
        }
        if !isValidEmail(email) {
            alertMessage = "Invalid email format."
            return false
        }
        if password.count <= 6 {
            alertMessage = "Password must be longer than 6 characters."
            return false
        }
        return true
    }

    func isValidEmail(_ email: String) -> Bool {
        let emailRegex = #"^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"#
        return NSPredicate(format: "SELF MATCHES %@", emailRegex).evaluate(with: email)
    }
}

// MARK: - Checkbox
struct CheckboxToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        Button(action: { configuration.isOn.toggle() }) {
            Image(systemName: configuration.isOn ? "checkmark.square" : "square")
                .foregroundColor(.gray)
                .font(.system(size: 20))
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            LoginView()
        }
    }
}
