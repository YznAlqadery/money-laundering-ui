import { Link } from "react-router-dom";
import backgroundImage from "../../assets/images/bg-pic.png";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div
        className="flex-grow bg-cover bg-center w-full relative flex flex-col items-center justify-center sm:px-8 text-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-san-marino-100 max-w-4xl px-2 sm:px-0">
          AML Fraud Detection and Transaction Monitoring System
        </h1>
        <p className="text-base sm:text-xl text-san-marino-100 max-w-3xl mt-6 px-2 sm:px-0">
          FraudGuard is a powerful tool that helps businesses detect and prevent
          fraud. It uses advanced machine learning algorithms to analyze large
          amounts of data and identify patterns that may indicate fraudulent
          activity. FraudGuard also provides real-time monitoring of
          transactions, allowing businesses to take immediate action when
          suspicious activity is detected.
        </p>
        <div className="flex flex-col sm:flex-row justify-center mt-2 mb-6 gap-1 sm:gap-10 w-full max-w-md px-2 sm:px-0 sm:mt-6">
          <Link
            to={"/login"}
            className="bg-san-marino-300   text-san-marino-950 px-4 py-2 rounded-full text-lg font-medium hover:bg-san-marino-200 text-center sm:px-8"
          >
            Login
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
