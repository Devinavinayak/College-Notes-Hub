package com.college.notes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import com.fasterxml.jackson.databind.JsonNode;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class TwilioVerifyService {
    private final String accountSid;
    private final String authToken;
    private final String verifyServiceSid;
    private final RestClient restClient = RestClient.create();

    public TwilioVerifyService(
            @Value("${twilio.account-sid:}") String accountSid,
            @Value("${twilio.auth-token:}") String authToken,
            @Value("${twilio.verify-service-sid:}") String verifyServiceSid) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.verifyServiceSid = verifyServiceSid;
    }

    public boolean isValidPhoneNumber(String phone) {
        return phone != null && phone.matches("^\\+[1-9]\\d{7,14}$");
    }

    public void sendVerification(String phone) {
        assertConfigured();
        post("https://verify.twilio.com/v2/Services/" + verifyServiceSid + "/Verifications",
                "To=" + encode(phone) + "&Channel=sms");
    }

    public boolean checkVerification(String phone, String code) {
        assertConfigured();
        JsonNode response = post("https://verify.twilio.com/v2/Services/" + verifyServiceSid + "/VerificationCheck",
                "To=" + encode(phone) + "&Code=" + encode(code));
        return response != null && "approved".equals(response.path("status").asText());
    }

    public void assertConfigured() {
        if (accountSid.isBlank() || authToken.isBlank() || verifyServiceSid.isBlank()) {
            throw new IllegalStateException("SMS password reset is not configured. Set the Twilio environment variables and restart the backend.");
        }
    }

    private JsonNode post(String url, String formBody) {
        String credentials = Base64.getEncoder().encodeToString(
                (accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8));
        try {
            return restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .header("Authorization", "Basic " + credentials)
                    .body(formBody)
                    .retrieve()
                    .body(JsonNode.class);
        } catch (RestClientException e) {
            throw new IllegalStateException("Twilio could not process the SMS verification request. Check the Twilio configuration and try again.");
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
