import './App.css';
import { useState } from "react";
// Import icons for a cleaner UI
import { FaMicrophone, FaVolumeUp, FaCopy, FaLanguage } from 'react-icons/fa';

export default function App() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // 🎙 Speech-to-Text
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in your browser");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN"; // Set to Hindi for broader recognition
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      setText(event.results[0][0].transcript);
    };
    recognition.onerror = () => setListening(false);

    recognition.start();
  };

  // 🔊 Speak the translated text
  const speak = (textToSpeak) => {
    if (!window.speechSynthesis || !textToSpeak) return;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    // You might need to find the correct voice for Garhwali if available
    // For now, using Hindi as a placeholder
    utterance.lang = "hi-IN";
    utterance.pitch = 1;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // ✨ Translate
  const translate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setTranslation("");
    try {
      const res = await fetch("https://garhwali-ai-backend.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      typeWriterEffect(data.translation);
    } catch (err) {
      console.error(err);
      // Let the user know if something went wrong
      setTranslation("Sorry, an error occurred.");
    }
    setLoading(false);
  };

  // ✍️ Typewriter effect for displaying the translation
  const typeWriterEffect = (fullText) => {
    let index = 0;
    const interval = setInterval(() => {
      setTranslation(fullText.substring(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 40); // Slightly faster typing
  };

  // 📋 Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(translation);
    alert("Translation copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white/25 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-lg text-white space-y-6">

        {/* --- Header --- */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Garhwali Guru AI</h1>
          <p className="text-white/80 mt-1">Translate English/Hindi to Garhwali</p>
        </div>

        {/* --- Input Area --- */}
        <div className="relative">
          <textarea
            className="w-full p-4 pr-16 rounded-lg text-black bg-white/90 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition"
            rows="4"
            placeholder="Type or speak here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={startListening}
            className={`absolute top-3 right-3 p-3 rounded-full text-white transition-all duration-300 ${
              listening ? 'bg-red-500 pulse' : 'bg-purple-500 hover:bg-purple-600'
            }`}
            aria-label="Start Listening"
          >
            <FaMicrophone size={20} />
          </button>
        </div>

        {/* --- Translate Button --- */}
        <button
          onClick={translate}
          disabled={loading || !text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <FaLanguage size={20} />
              <span>Translate</span>
            </>
          )}
        </button>

        {/* --- Translation Output --- */}
        {translation && (
          <div className="fade-in p-5 bg-black/40 rounded-lg space-y-4">
            <h2 className="font-semibold text-lg text-yellow-300">Garhwali Translation:</h2>
            <p className="text-lg leading-relaxed">{translation}</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => speak(translation)}
                className="p-3 bg-green-500 hover:bg-green-600 rounded-full transition"
                aria-label="Speak Translation"
              >
                <FaVolumeUp />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition"
                aria-label="Copy Translation"
              >
                <FaCopy />
              </button>
            </div>
          </div>
        )}
      </div>
       <footer className="text-center text-white/70 mt-8">
            <p>Built with ❤️ for the mountains</p>
       </footer>
    </div>
  );
}




