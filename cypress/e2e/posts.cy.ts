describe("Posts", () => {
    before(() => {
        const api = Cypress.env("VITE_API_URL");

        cy.request(api + "/users").then((res) => {
            if (
                (res.body as any[]).filter((el) => el.username === "test")
                    .length <= 0
            ) {
                cy.request("POST", api + "/users/register", {
                    username: "test",
                    password: "test1234",
                    email: "test@example.com",
                });
            }
        });
    });
    beforeEach(() => {
        cy.visit("/");
        cy.get(".header-actions > .button").contains("login").click();
        cy.get(".input[name='username']").type("test");
        cy.get(".input[name='password']").type("test1234");
        cy.get(".login-form").submit();
        cy.wait(100);
    });

    it("creates post", () => {
        cy.get(".post-create-content").type("test post 1");
        cy.intercept("**/posts/").as("createPost");
        cy.get(".post-create-form").submit();

        cy.wait("@createPost");
        cy.get(".post-card-content").should("contain", "test post 1");
    });

    it("creates post with tags", () => {
        cy.get(".post-create-content").type("test post 2");
        cy.get(".tag-input-field").type("testTag");
        cy.get(".tag-input-add").click();

        cy.intercept("**/posts/").as("createPost");
        cy.get(".post-create-form").submit();

        cy.wait("@createPost");
        cy.get(".tag-filter-tag ").contains("testTag").click();
        cy.get(".post-card-content").should("contain", "test post 2");
        cy.get(".tag-filter-tag ").contains("testTag").click();
    });

    it("adds like to post", () => {
        cy.get(".post-create-content").type("test post 3");
        cy.get(".tag-input-field").type("testTag");
        cy.get(".tag-input-add").click();

        cy.intercept("**/posts/").as("createPost");
        cy.get(".post-create-form").submit();
        cy.wait("@createPost");

        cy.contains(".post-card", "test post 3")
            .find(".post-card-like")
            .click();
        cy.intercept("**/like_status").as("addLike");
        cy.wait("@addLike");
        cy.get(".post-card").contains("span", "1 like").should("exist");
    });
    it("removes like from post", () => {
        cy.get(".post-create-content").type("test post 4");
        cy.get(".tag-input-field").type("testTag");
        cy.get(".tag-input-add").click();

        cy.intercept("**/posts/").as("createPost");
        cy.get(".post-create-form").submit();
        cy.wait("@createPost");

        cy.contains(".post-card", "test post 4")
            .find(".post-card-like")
            .click();
        cy.intercept("**/like_status").as("addLike");
        cy.wait("@addLike");
        cy.get(".post-card").contains("span", "1 like").should("exist");

        cy.contains(".post-card", "test post 4")
            .find(".post-card-like")
            .click();
        cy.intercept("**/like_status").as("addLike");
        cy.wait("@addLike");
        cy.get(".post-card").contains("span", "0 likes").should("exist");
    });

    it("adds comment to post", () => {
        cy.get(".post-create-content").type("test post 5");
        cy.get(".tag-input-add").click();

        cy.intercept("**/posts/").as("createPost");
        cy.get(".post-create-form").submit();
        cy.wait("@createPost");

        cy.contains(".post-card", "test post 5").click();
        cy.get(".comment-create-content").type("test comment");
        cy.intercept("**/comments").as("addComment");
        cy.get(".comment-create-form").submit();

        cy.wait("@addComment");
        cy.get(".comment-card").should("contain", "test comment");
        cy.get(".post-display-footer")
            .contains("span", "1 comment")
            .should("exist");
        cy.get(".post-modal-close").click();
    });
    it("does not create post after logout", () => {
        cy.contains("button", "logout").click();
        cy.get(".post-create-content").type("test post 6");
        cy.intercept("**/posts/").as("createPost");
        cy.get(".post-create-form").submit();

        cy.contains(".post-card", "test post 6").should("not.exist");
    });
    it("deletes post", () => {
        cy.get(".post-card-delete").each(($el) => {
            cy.wrap($el).click();
            cy.get(".confirm-modal-confirm-danger").click();
            cy.wait(100);
        });
    });
});
