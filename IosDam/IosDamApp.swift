import SwiftUI

@main
struct IosDamApp: App {
    var body: some Scene {
        WindowGroup {
            NavigationView {
                SplashView()
                    .navigationBarHidden(true)
                    .navigationBarBackButtonHidden(true)
                    .edgesIgnoringSafeArea(.all)
            }
            .navigationViewStyle(StackNavigationViewStyle())
        }
    }
}
