import { test, expect } from "@playwright/test";

test("logs in with valid credentials", async ({ page, context }) => {
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

    const d = page.getByRole("dialog")
    const b = d.getByRole("button", { name: "login" });
    await b.click();

    await d.waitFor({ state: "detached" });

    const s = await context.storageState();

    expect(
        s.origins
            .find(({ origin }) => origin === "http://localhost:5173")
            ?.localStorage
            .find(({ name }) => name === "token")
            ?.name
    ).toBeDefined();
});

test("fails to log in with invalid credentials", async ({ page }) => {
    await page.goto("./");

    await page.getByRole("button", { name: "login" }).click();

    await page
        .getByRole("textbox")
        .and(page.getByLabel("username:"))
        .fill("test");
    await page
        .getByRole("textbox")
        .and(page.getByLabel("password:"))
        .fill("4321test");

    const d = page.getByRole("dialog")
    const b = d.getByRole("button", { name: "login" });
    await b.click();

    await d.waitFor({ state: "detached" });

    expect(page.getByRole("heading", { name: "Login error" })).toBeVisible();
});
