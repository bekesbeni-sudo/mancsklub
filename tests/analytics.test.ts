import { describe, expect, it } from "vitest";
import { publicPageUrl } from "@/lib/analytics";

describe("analytics url filter", () => {
  it("keeps public pages without the query string", () => {
    expect(publicPageUrl("https://mancsklub.hu/")).toBe("https://mancsklub.hu/");
    expect(publicPageUrl("https://mancsklub.hu/partnereknek?x=1")).toBe("https://mancsklub.hu/partnereknek");
    expect(publicPageUrl("https://mancsklub.hu/megerosites?token=secret")).toBe("https://mancsklub.hu/megerosites");
  });

  it("drops private areas", () => {
    for (const path of ["/admin", "/admin/varolista", "/rendelo", "/belepes/jelszo?token=a", "/gazdi/belepes", "/elszamolas"]) {
      expect(publicPageUrl(`https://mancsklub.hu${path}`)).toBeNull();
    }
    expect(publicPageUrl("https://mancsklub.hu/administrator")).toBe("https://mancsklub.hu/administrator");
  });
});
