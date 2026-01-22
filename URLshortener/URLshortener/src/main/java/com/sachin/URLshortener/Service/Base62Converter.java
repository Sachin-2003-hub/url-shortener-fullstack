package com.sachin.URLshortener.Service;

public class Base62Converter {
    // The characters we allow in our short url
    private static final String ALLOWED_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = 62;

    // Encodes a number into a Base62 string
    // Example: 1000 -> "g8"
    public static String encode(long input) {
        StringBuilder encodedString = new StringBuilder();

        if(input == 0) {
            return String.valueOf(ALLOWED_CHARACTERS.charAt(0));
        }

        while (input > 0) {
            encodedString.append(ALLOWED_CHARACTERS.charAt((int) (input % BASE)));
            input = input / BASE;
        }

        return encodedString.reverse().toString();
    }

    // Decodes a Base62 string back into a number
    // Example: "g8" -> 1000
    public static long decode(String input) {
        char[] characters = input.toCharArray();
        int length = characters.length;

        long decoded = 0;

        // Counter is used to track the power of 62 (62^0, 62^1, etc.)
        int counter = 1;

        for (int i = 0; i < length; i++) {
            decoded += ALLOWED_CHARACTERS.indexOf(characters[length - 1 - i]) * counter;
            counter *= BASE;
        }

        return decoded;
    }
}
