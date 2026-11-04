package com.bounce002.backend.auth;

import java.util.Set;

/** A starter list of throwaway email domains. Grow it over time. */
public final class DisposableEmails {
    private static final Set<String> DOMAINS = Set.of(
            "mailinator.com", "guerrillamail.com", "guerrillamail.net", "10minutemail.com", "tempmail.com",
            "temp-mail.org", "yopmail.com", "trashmail.com", "getnada.com", "sharklasers.com", "maildrop.cc",
            "dispostable.com", "throwawaymail.com", "fakeinbox.com", "mintemail.com", "tempinbox.com",
            "mailnesia.com", "moakt.com", "emailondeck.com", "burnermail.io");

    private DisposableEmails() {}

    public static boolean isDisposable(String email) {
        return DOMAINS.contains(email.substring(email.lastIndexOf('@') + 1).toLowerCase());
    }
}
