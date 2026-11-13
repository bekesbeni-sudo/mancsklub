import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { confirmationEmailHtml, surveyEmailHtml } from "@/lib/email-template";

describe("confirmation email", () => {
  const url = "https://mancsklub.hu/megerosites?token=abc.def";

  it("links the button and the fallback text to the confirmation page", () => {
    const html = confirmationEmailHtml(url);
    expect(html.match(/href="https:\/\/mancsklub\.hu\/megerosites\?token=abc\.def"/g)).toHaveLength(2);
  });

  it("loads PNG images from the live site, never WebP", () => {
    const html = confirmationEmailHtml(url);
    const images = [...html.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
    expect(images).toEqual([`https://${site.domain}/email/logo.png`, `https://${site.domain}/email/pets.png`]);
  });

  it("escapes the link so it cannot break out of the attribute", () => {
    const html = confirmationEmailHtml('https://x.hu/"><script>');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&quot;&gt;&lt;script&gt;");
  });
});

describe("survey email", () => {
  const url = "https://mancsklub.hu/megerosites?token=abc.def";

  it("has the confirm button, the fallback link and a link to the site", () => {
    const html = surveyEmailHtml(url);
    expect(html.match(/href="https:\/\/mancsklub\.hu\/megerosites\?token=abc\.def"/g)).toHaveLength(2);
    expect(html).toContain(`href="https://${site.domain}/"`);
  });

  it("uses no em dashes in the text", () => {
    expect(surveyEmailHtml(url)).not.toContain("—");
  });
});
