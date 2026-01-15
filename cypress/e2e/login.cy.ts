describe("Login", () => {
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
    });

    it("logs in with valid credentials", () => {
        cy.get(".input[name='username']").type("test");
        cy.get(".input[name='password']").type("test1234");
        cy.get(".login-form").submit();

        const origin = Cypress.config("baseUrl")!;
        cy.wait(500);

        cy.getAllLocalStorage().then((res) => {
            expect(res[origin].token).to.be.not.null;
        });

        cy.get(".header-actions > .button").should("contain", "logout");

        cy.visit("/account");
        cy.url().should("include", "/account");
        cy.get("h2").should("contain", "hello, test");
    });

    it("fails to login with invalid credentials", () => {
        cy.get(".input[name='username']").type("test");
        cy.get(".input[name='password']").type("4321tset");
        cy.get(".login-form").submit();

        cy.get(".alert-modal").should("exist");
        cy.get(".alert-modal-title").should("contain", "Login Error");
        cy.get(".alert-modal-message").should(
            "contain",
            "Incorrent username or password",
        );
    });
});
