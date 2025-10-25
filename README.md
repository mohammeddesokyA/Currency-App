# Currency Converter App 💲



A modern and feature-rich currency converter application built with React, Vite, and Tailwind CSS. It allows users to convert amounts between various currencies, view historical exchange rates, manage favorite currencies, and more, using the free [frankfurter.app](https://frankfurter.app/) API.

## ✨ Features

* **Real-time Conversion:** Converts currency amounts using the latest exchange rates.
* **Single & Multi-Mode:** Supports converting to a single currency or multiple currencies simultaneously.
* **Historical Rates Chart:** Displays a 30-day historical exchange rate chart between selected currencies using `recharts`.
* **Favorites Management:** Users can add/remove favorite currencies for quick access. A dedicated sidebar displays favorites.
* **Searchable Dropdowns:** Uses `react-select` for modern, searchable currency selection dropdowns.
* **Dark Mode:** Includes a theme toggle for light and dark mode preferences, saved in local storage.
* **Responsive Design:** Adapts layout for different screen sizes, including a modal for favorites on mobile.
* **Input Formatting:** Automatically formats large numbers with commas in the amount input field.
* **Reverse Rate Display:** Shows both the direct and reverse exchange rates (e.g., 1 USD = X EUR and 1 EUR = Y USD).
* **Copy to Clipboard:** Allows users to easily copy the converted amount.
* **Loading Skeleton:** Displays a loading state while fetching initial currency data.
* **Toast Notifications:** Uses `react-hot-toast` for user feedback (e.g., copied amount, added/removed favorite, errors).
* **State Persistence:** Remembers the last used amount, 'from' currency, 'to' currency, and favorite currencies using local storage.
* **Glassmorphism UI:** Features a modern, blurred background effect for UI elements.

## 🛠️ Technologies Used

* **Frontend:** React (with Vite)
* **Styling:** Tailwind CSS
* **Dropdowns:** `react-select`
* **Charts:** `recharts`
* **Notifications:** `react-hot-toast`
* **Icons:** `react-icons`

## 📊 API Used

* **Exchange Rates:** [frankfurter.app](https://frankfurter.app/) (Free, no API key required)

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd currency-app 
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5175` (or the port specified in your terminal).

--------------------------------------------------------------
