import { test, expect } from "@playwright/test";
test.describe.configure({ mode: "serial", workers: 1 });

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

test.afterEach(async ({ page }) => {
    const deleteButtons = page.getByRole("button", {
        name: "Delete post",
        exact: true,
    });
    while ((await deleteButtons.count()) > 0) {
        const b = deleteButtons.first();

        await b.click();

        const confirm = page.getByRole("button", {
            name: "Delete",
            exact: true,
        });
        await confirm.click();
        await confirm.waitFor({ state: "detached" });
        await page.waitForTimeout(100);
    }
});

test("create post", async ({ page }) => {
    await page
        .getByRole("textbox")
        .and(page.getByPlaceholder("What's on your mind?"))
        .fill("test post");

    const responsePromise = page.waitForResponse(
        "http://localhost:8000/posts/",
    );
    const b = page.getByRole("button", { name: "Post", exact: true });
    await b.click();

    await responsePromise;

    const items = page.getByText("test post", { exact: true });
    expect(items).not.toHaveCount(0);
});

test("create post with tags", async ({ page }) => {
    await page
        .getByRole("textbox")
        .and(page.getByPlaceholder("What's on your mind?"))
        .fill("test post with tags");

    await page
        .getByRole("textbox")
        .and(page.getByPlaceholder("Add tag..."))
        .fill("testTag");

    await page.getByRole("button", { name: "+", exact: true }).click();

    const responsePromise = page.waitForResponse("http://localhost:8000/tags/");
    const b = page.getByRole("button", { name: "Post", exact: true });
    await b.click();

    await responsePromise;

    expect(
        page.getByRole("button", { name: "testTag", exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "testTag", exact: true }).click();

    const items = page.getByText("test post with tags", { exact: true });
    expect(items).not.toHaveCount(0);
});

test("add like to post", async ({ page }) => {
    await page
        .getByRole("textbox")
        .and(page.getByPlaceholder("What's on your mind?"))
        .fill("test post");

    const b = page.getByRole("button", { name: "Post", exact: true });
    await b.click();

    await page.waitForResponse("http://localhost:8000/posts/");

    await page.getByRole("button", { name: "♡ Like", exact: true }).click();
    await page.waitForResponse((response) =>
        response.url().includes("/like_status"),
    );

    expect(page.locator(".post-card-stat").nth(1)).toHaveText("1 like");
});

test("add new comment to post", async ({ page }) => {
    await page
        .getByRole("textbox")
        .and(page.getByPlaceholder("What's on your mind?"))
        .fill("test post");

    await page.getByRole("button", { name: "Post", exact: true }).click();

    await page.waitForResponse("http://localhost:8000/posts/");

    await page.locator(".post-card").click();

    await page
        .getByRole("textbox")
        .and(page.getByPlaceholder("Write a comment..."))
        .fill("test comment");

    await page.getByRole("button", { name: "Comment", exact: true }).click();
    await page.waitForResponse("http://localhost:8000/posts/comments");

    expect(page.getByText("test comment", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "×", exact: true }).click();
    await page.locator(".post-modal").waitFor({ state: "detached" });
});
