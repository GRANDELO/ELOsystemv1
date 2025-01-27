import React, { useState, useEffect } from "react";

const TextToSpeech = () => {
    const [text, setText] = useState(""); // User input text
    const [isSpeaking, setIsSpeaking] = useState(false); // Speech status
    const [voices, setVoices] = useState([]); // Available voices
    const [filteredVoices, setFilteredVoices] = useState([]); // Voices filtered by language
    const [selectedVoice, setSelectedVoice] = useState(""); // Selected voice
    const [selectedLang, setSelectedLang] = useState("en-UK"); // Selected language
    const [rate, setRate] = useState(1); // Speech speed
    const [pitch, setPitch] = useState(1); // Speech pitch
    const [darkMode, setDarkMode] = useState(false); // Dark mode toggle

    // Available languages
    const languages = [
        { code: "en-UK", label: "English (UK)" },
        { code: "en-US", label: "English (US)" },
        { code: "sw", label: "Swahili" },
        { code: "fr", label: "French" },
        { code: "es", label: "Spanish" },
    ];

    // Fetch voices and filter by selected language
    useEffect(() => {
        const fetchVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Set default selected voice
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices[0].name);
            }

            // Filter voices based on selected language
            const filtered = availableVoices.filter((voice) =>
                voice.lang.startsWith(selectedLang)
            );
            setFilteredVoices(filtered);
            if (filtered.length > 0) setSelectedVoice(filtered[0].name);
        };

        // Fetch voices when the component mounts or when voices change
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = fetchVoices;
        } else {
            fetchVoices();
        }
    }, [selectedLang]);

    const speakText = () => {
        if (!text) {
            alert("Please enter some text to read!");
            return;
        }

        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = selectedLang; // Set selected language
        speech.voice = voices.find((voice) => voice.name === selectedVoice);
        speech.rate = rate; // Set speed
        speech.pitch = pitch; // Set pitch
        speech.volume = 1; // Set volume

        speech.onstart = () => setIsSpeaking(true);
        speech.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(speech);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div
            style={{
                textAlign: "center",
                marginTop: "50px",
                backgroundColor: darkMode ? "#333" : "#fff",
                color: darkMode ? "#fff" : "#000",
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            {/* Dark mode toggle */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: darkMode ? "#fff" : "#333",
                    color: darkMode ? "#000" : "#fff",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                }}
            >
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <h1>React Text-to-Speech</h1>

            {/* Text area for input */}
            <textarea
                rows="5"
                cols="50"
                placeholder="Type your sentence here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                    width: "80%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
            ></textarea>
            <br />
            <br />

            {/* Language selection */}
            <label htmlFor="language">Select Language: </label>
            <select
                id="language"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                style={{ padding: "5px", margin: "10px 0" }}
            >
                {languages.map((lang, index) => (
                    <option key={index} value={lang.code}>
                        {lang.label}
                    </option>
                ))}
            </select>
            <br />

            {/* Voice selection */}
            <label htmlFor="voices">Select Voice: </label>
            <select
                id="voices"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                style={{ padding: "5px", margin: "10px 0" }}
            >
                {filteredVoices.length > 0 ? (
                    filteredVoices.map((voice, index) => (
                        <option key={index} value={voice.name}>
                            {voice.name} ({voice.lang})
                        </option>
                    ))
                ) : (
                    <option>No voices available</option>
                )}
            </select>
            <br />

            {/* Speed and pitch controls */}
            <div style={{ margin: "20px 0" }}>
                <label htmlFor="rate">Speed: {rate}</label>
                <input
                    id="rate"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    style={{ margin: "0 10px" }}
                />
                <br />
                <label htmlFor="pitch">Pitch: {pitch}</label>
                <input
                    id="pitch"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    style={{ margin: "0 10px" }}
                />
            </div>

            {/* Buttons for speech controls */}
            <button
                onClick={isSpeaking ? stopSpeaking : speakText}
                style={{
                    padding: "10px 20px",
                    backgroundColor: isSpeaking ? "#f44336" : "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px",
                }}
            >
                {isSpeaking ? "Stop" : "Read Out Loud"}
            </button>
        </div>
    );
};

export default TextToSpeech;
