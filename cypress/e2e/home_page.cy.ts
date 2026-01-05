describe("The Home Page", () => {
    it("successfully loads", () => {
        cy.visit("/");
    });

    it("navigates to game list", () => {
        cy.visit("/");
        cy.get("a.header-nav-link[href='/games']").click();
        cy.url().should("include", "/games");
    });
});
