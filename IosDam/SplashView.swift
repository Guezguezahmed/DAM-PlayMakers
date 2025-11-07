import SwiftUI

struct SplashView: View {
    @State private var isActive = false

    var body: some View {
        ZStack {
            // ✅ Fond en plein écran avec ton image
            Image("splash_page")
                .resizable()
                .scaledToFill() // couvre tout l’écran
                .ignoresSafeArea() // empêche les marges
            
            // ✅ Texte par-dessus (si tu veux garder ton titre)
            VStack {
                Spacer()
                Text("DAM")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.bottom, 80)
            }
        }
        .onAppear {
            // ⏱️ Redirection automatique après 2 secondes
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                withAnimation {
                    isActive = true
                }
            }
        }
        // ✅ Transition vers LoginView quand terminé
        .fullScreenCover(isPresented: $isActive) {
            FirstView()
        }
    }
}

struct SplashView_Previews: PreviewProvider {
    static var previews: some View {
        SplashView()
            .previewDevice("iPhone 11") // choisis le modèle que tu veux
    }
}
