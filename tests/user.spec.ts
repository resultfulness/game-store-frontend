import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "login" }).click();

    await page
        .getByRole("textbox")
        .and(page.getByLabel("username:"))
        .fill("test");
    await page
        .getByRole("textbox")
        .and(page.getByLabel("password:"))
        .fill("test1234");

    const d = page.getByRole("dialog");
    const b = d.getByRole("button", { name: "login" });
    await b.click();

    await d.waitFor({ state: "detached" });
});

test("correct user data is displayed in user info tab", async ({ page }) => {
    expect(page.getByRole("link", { name: "test" })).toBeVisible();
    await page.getByRole("link", { name: "test" }).click();
    expect(page.getByText("test@example.com", { exact: true }));
});

test("logout logged user", async ({ page }) => {
    await page.getByRole("button", { name: "logout", exact: true }).click();
    expect(page.getByRole("link", { name: "test" })).not.toBeVisible();
    await page
        .getByRole("textbox")
        .and(page.getByPlaceholder("What's on your mind?"))
        .fill("test post");

    const count = await page.locator('.post-card').count()

    await page.getByRole("button", { name: "Post", exact: true }).click();
    await page.waitForResponse("http://localhost:8000/posts/");

    await expect(page.locator('.post-card')).toHaveCount(count);
});
