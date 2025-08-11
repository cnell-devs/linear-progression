import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

export function WorkoutAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Search for workouts...",
  className = "",
  disabled = false,
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search function
  const searchGlobalWorkouts = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/v2/workouts/global/search?q=${encodeURIComponent(
          searchQuery
        )}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const workouts = await response.json();
        setSuggestions(workouts);
      } else {
        console.error("Failed to search workouts");
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching workouts:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
    setIsOpen(true);

    if (onChange) {
      onChange(newQuery);
    }

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      searchGlobalWorkouts(newQuery);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelect = (workout) => {
    setQuery(workout.name);
    setIsOpen(false);
    setSuggestions([]);
    setSelectedIndex(-1);

    if (onSelect) {
      onSelect(workout);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        // Allow manual workout creation if no suggestions
        if (query.trim() && onSelect) {
          onSelect({ name: query.trim(), isCustom: true });
        }
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const hasCustomOption =
          query.trim() &&
          !suggestions.some(
            (w) => w.name.toLowerCase() === query.toLowerCase()
          );
        const maxIndex =
          suggestions.length > 0
            ? hasCustomOption
              ? suggestions.length
              : suggestions.length - 1
            : hasCustomOption
            ? 0
            : -1;
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
        break;
      }
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        } else if (
          selectedIndex === suggestions.length ||
          (query.trim() && suggestions.length === 0)
        ) {
          // Create custom workout when selecting the custom option or when no suggestions exist
          onSelect({ name: query.trim(), isCustom: true });
        } else if (query.trim() && onSelect) {
          // Allow manual workout creation as fallback
          onSelect({ name: query.trim(), isCustom: true });
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        listRef.current &&
        !listRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update query when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`input input-bordered w-full pr-10 ${className}`}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsOpen(true);
            if (query.trim()) {
              searchGlobalWorkouts(query);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        )}

        {/* Search icon */}
        {!isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="material-icons text-gray-400 text-lg">search</span>
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen &&
        (suggestions.length > 0 ||
          isLoading ||
          (query.trim() &&
            !suggestions.some(
              (w) => w.name.toLowerCase() === query.toLowerCase()
            ))) && (
          <div
            ref={listRef}
            className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {isLoading && suggestions.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((workout, index) => (
                <div
                  key={workout.id}
                  className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                    index === selectedIndex ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelect(workout)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {workout.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {workout.muscleGroup && (
                          <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                            {workout.muscleGroup}
                          </span>
                        )}
                        {workout.equipment && (
                          <span className="bg-green-100 px-2 py-1 rounded text-xs">
                            {workout.equipment}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="material-icons text-gray-400 text-sm">
                      add
                    </span>
                  </div>
                </div>
              ))
            ) : query.trim() && !isLoading ? (
              <div className="p-3 text-center text-gray-500">
                No matching workouts found
              </div>
            ) : null}

            {/* Allow custom workout creation */}
            {query.trim() &&
              !suggestions.some(
                (w) => w.name.toLowerCase() === query.toLowerCase()
              ) && (
                <div
                  className={`p-3 cursor-pointer ${
                    suggestions.length > 0 ? "border-t border-gray-200" : ""
                  } hover:bg-gray-50 ${
                    selectedIndex ===
                    (suggestions.length > 0 ? suggestions.length : 0)
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelect({ name: query.trim(), isCustom: true })
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-blue-500 text-sm">
                      add_circle
                    </span>
                    <span className="text-gray-700">
                      Create &ldquo;{query.trim()}&rdquo; as custom workout
                    </span>
                  </div>
                </div>
              )}
          </div>
        )}
    </div>
  );
}

WorkoutAutocomplete.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
