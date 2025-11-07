//
//  RegisterView.swift
//  IosDam
//
//  Created by Wassim Abdelli on 7/11/2025.
//

import SwiftUI

struct RegisterView: View {
    @State private var nom: String = ""
    @State private var prenom: String = ""
    @State private var tel: String = ""
    @State private var email: String = ""
    @State private var age: Date = Date()
    @State private var role: String = ""
    @State private var password: String = ""
    @State private var confirmPassword: String = ""
    
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    let roles = ["JOUEUR", "ARBITRE", "OWNER"]
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    Text("Create Account")
                        .font(.title)
                        .fontWeight(.bold)
                        .padding(.top, 40)
                    
                    // NOM
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Image(systemName: "person")
                                .foregroundColor(.gray)
                            TextField("Nom", text: $nom)
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                        
                        if nom.isEmpty {
                            Text("⚠️ Le nom est obligatoire")
                                .foregroundColor(.red)
                                .font(.caption)
                                .padding(.leading, 30)
                        }
                    }
                    
                    // PRENOM
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Image(systemName: "person.text.rectangle")
                                .foregroundColor(.gray)
                            TextField("Prenom", text: $prenom)
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                    }
                    
                    // TEL
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Image(systemName: "phone")
                                .foregroundColor(.gray)
                            TextField("Téléphone", text: $tel)
                                .keyboardType(.numberPad)
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                        
                        if !tel.isEmpty && !isValidTunisianPhone(tel) {
                            Text("⚠️ Numéro tunisien invalide (2xxxxxxx ou 9xxxxxxx)")
                                .foregroundColor(.red)
                                .font(.caption)
                                .padding(.leading, 30)
                        }
                    }
                    
                    // EMAIL
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Image(systemName: "envelope")
                                .foregroundColor(.gray)
                            TextField("Email", text: $email)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                        
                        if !email.isEmpty && !isValidEmail(email) {
                            Text("⚠️ Format email invalide")
                                .foregroundColor(.red)
                                .font(.caption)
                                .padding(.leading, 30)
                        }
                    }
                    
                    // AGE
                    HStack {
                        Image(systemName: "calendar")
                            .foregroundColor(.gray)
                        DatePicker("Date de naissance", selection: $age, displayedComponents: .date)
                            .datePickerStyle(CompactDatePickerStyle())
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                    .padding(.horizontal)
                    
                    // ROLE
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Image(systemName: "person.3")
                                .foregroundColor(.gray)
                            Menu {
                                ForEach(roles, id: \.self) { r in
                                    Button(action: { role = r }) {
                                        Text(r)
                                    }
                                }
                            } label: {
                                HStack {
                                    Text(role.isEmpty ? "Choisir un rôle" : role)
                                        .foregroundColor(role.isEmpty ? .gray : .black)
                                    Spacer()
                                    Image(systemName: "chevron.down")
                                        .foregroundColor(.gray)
                                }
                            }
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                        
                        if role.isEmpty {
                            Text("⚠️ Choisissez un rôle")
                                .foregroundColor(.red)
                                .font(.caption)
                                .padding(.leading, 30)
                        }
                    }
                    
                    // PASSWORD
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Image(systemName: "lock")
                                .foregroundColor(.gray)
                            SecureField("Mot de passe", text: $password)
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                        
                        if !password.isEmpty && password.count < 6 {
                            Text("⚠️ Minimum 6 caractères")
                                .foregroundColor(.red)
                                .font(.caption)
                                .padding(.leading, 30)
                        }
                    }
                    
                    // CONFIRM PASSWORD
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Image(systemName: "lock.rotation")
                                .foregroundColor(.gray)
                            SecureField("Confirmer le mot de passe", text: $confirmPassword)
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                        
                        if !confirmPassword.isEmpty && confirmPassword != password {
                            Text("⚠️ Les mots de passe ne correspondent pas")
                                .foregroundColor(.red)
                                .font(.caption)
                                .padding(.leading, 30)
                        }
                    }
                    
                    // REGISTER BUTTON
                    Button(action: validateFields) {
                        HStack {
                            Text("Register")
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
                }
                
                Spacer()
                
                // Retour vers Login
                Group {
                    HStack {
                        Text("Already have an account?")
                            .foregroundColor(.black)
                        NavigationLink(destination: LoginView().navigationBarBackButtonHidden(true)) {
                            Text("Login")
                                .foregroundColor(.green)
                                .fontWeight(.semibold)
                        }
                    }
                    .padding(.bottom, 30)
                }
            }
            .navigationBarHidden(true)
            .alert(isPresented: $showAlert) {
                Alert(title: Text("Erreur"),
                      message: Text(alertMessage),
                      dismissButton: .default(Text("OK")))
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
    
    // MARK: - Validation (finale)
    func validateFields() {
        if nom.isEmpty {
            showError("Le nom est obligatoire.")
        } else if tel.isEmpty || !isValidTunisianPhone(tel) {
            showError("Numéro de téléphone invalide.")
        } else if email.isEmpty || !isValidEmail(email) {
            showError("Email invalide.")
        } else if role.isEmpty {
            showError("Veuillez choisir un rôle.")
        } else if password.isEmpty || confirmPassword.isEmpty {
            showError("Veuillez remplir les deux champs de mot de passe.")
        } else if password != confirmPassword {
            showError("Les mots de passe ne correspondent pas.")
        } else if password.count < 6 {
            showError("Le mot de passe doit contenir au moins 6 caractères.")
        } else {
            print("✅ Inscription validée pour \(email)")
        }
    }
    
    func showError(_ message: String) {
        alertMessage = message
        showAlert = true
    }
    
    func isValidEmail(_ email: String) -> Bool {
        let regex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        return NSPredicate(format: "SELF MATCHES %@", regex).evaluate(with: email)
    }
    
    func isValidTunisianPhone(_ phone: String) -> Bool {
        let regex = "^[2593][0-9]{7}$"
        return NSPredicate(format: "SELF MATCHES %@", regex).evaluate(with: phone)
    }
}

struct RegisterView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            RegisterView()
        }
    }
}
