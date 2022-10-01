beforeEach(() => {
  cy.visit('/')
  cy.contains("button", "Item Details").click()
})

describe('state', () => {
  it('has the correct state', () => {
    cy.get('.homeState').should('not.be.visible')
    cy.get('.searchState').should('not.be.visible')
    cy.get('.itemState').should('be.visible')
  })

  it('changes to search state when search is clicked', () => {
    cy.get('#searchBtn').click()
    cy.get('.homeState').should('not.be.visible')
    cy.get('.searchState').should('be.visible')
    cy.get('.itemState').should('not.be.visible')
  })

  it('changes to home state when title is clicked', () => {
    cy.contains("SellPhone").click()
    cy.get('.homeState').should('be.visible')
    cy.get('.searchState').should('not.be.visible')
    cy.get('.itemState').should('not.be.visible')
  })

})

describe('navbar', () => {
  it('displays website name', () => {
    //navbar contains name of the website 
    cy.get('.navbar ').contains("SellPhone").should("be.visible")

  })

  it('displays serach box', () => {
    cy.get('.navbar ').find("input[type='text']").should("be.visible")
  })

  it('displays serach button', () => {
    cy.get('.navbar ').contains("button", "Search").should("be.visible")
  })

  it('displays Sign In button', () => {
    cy.get('.navbar ').contains("button", "Sign In").should("be.visible")
  })


  it('hides Log Out button', () => {
    cy.get('.navbar ').contains("button", "Log Out").should("not.be.visible")
  })

  it('hides Profile button', () => {
    cy.get('.navbar ').contains("button", "Profile").should("not.be.visible")
  })

  it('dipslays catagory dropdown', () => {
    cy.get('.navbar ').find("select").should("be.visible")
  })

  //currently an error as it is displayed but should be hidden 
  it('hides price range bar button', () => {
    cy.get('.navbar ').find("input[type='range']").should("not.be.visible")
  })
})

describe('phone details', () => {


  it('should display brand', () => {
    cy.get(".itemDetails").contains("Brand: ").should("be.visible")
  })

  it('should display Available Stock  mock', () => {
    cy.get(".itemDetails").contains("Available Stock: ").should("be.visible")
  })

  it('should display price mock ', () => {
    cy.get(".itemDetails").contains("Price: ").should("be.visible")
  })

  it('should display seller mock', () => {
    cy.get(".itemDetails").contains("Seller: ").should("be.visible")
  })

})


describe('phone details mock', () => {

  beforeEach(() => {
    cy.visit('/')

    cy.intercept("GET", "http://localhost:3000/seller-details?id=*", {
      fixture: "seller.json"
    })
    cy.intercept("GET", "http://localhost:3000/search?id=*", {
      fixture: "item.json"
    })

    cy.contains("button", "Item Details").click()
  })

  it('should display phone title', ()=>{
    cy.get(".itemDetails").contains("phone title")
  })

  it('should display brand', () => {
    cy.get(".itemDetails").contains("Brand: Huawei").should("be.visible")
  })

  it('should display Available Stock  mock', () => {
    cy.get(".itemDetails").contains("Available Stock: 1").should("be.visible")
  })

  it('should display price mock ', () => {
    cy.get(".itemDetails").contains("Price: 127.95").should("be.visible")
  })

  it('should display seller mock', () => {
    cy.get(".itemDetails").contains("Seller: louis policarpio").should("be.visible")
  })
 
})

describe('reviews', () => {
  it('should display the Full name of reviewer,	Rating, Comment in each review', () => {
    cy.get(".review").each((review, index, list) => {
      cy.wrap(review).contains("Reviewer: ")
      cy.wrap(review).contains("Rating: ")
      cy.wrap(review).contains("Comment: ")
    })
  })
})


describe('reviews mock', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.intercept("GET", "http://localhost:3000/seller-details?id=*", {
      fixture: "seller.json"
    })
    cy.intercept("GET", "http://localhost:3000/search?id=*", {
      fixture: "item.json"
    })

    cy.contains("button", "Item Details").click()

  })

  it('should display the first 3 reviews', () => {
    cy.get(".review").should("have.length", 3)
  })

  it('should display the Full name of reviewer,	Rating, Comment in each review', () => {
    cy.contains("Reviewer: louis policarpio").should("be.visible")
    cy.contains("Rating: 1").should("be.visible")
    cy.contains("Comment: this is a phone").should("be.visible")
    cy.contains("Rating: 2").should("be.visible")
    cy.contains("Comment: this sucks").should("be.visible")
    cy.contains("Rating: 3").should("be.visible")
    //last comment is tested in the next test case
  })
  it('should expand a comment when read more is clicked mock', () => {
    cy.contains("Comment: this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long commentthis is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long commentthis is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long commentthis is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment")
      .should("not.exist")
    cy.contains("read more...").click()
    cy.contains("read more...").should("not.exist")
    cy.contains("Comment: this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long commentthis is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long commentthis is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long commentthis is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment this is a long comment")
      .should("be.visible")
  })
  //not working as it counts the hidden text in the comment grater than 200
    // it('should have a comment if the comment is more than 200 characters, to show the rest of the comment ', () => {
    //   cy.get(".review").each((review, index, list) => {
    //     //231 = 200 + read more... + comment: 
    //     cy.wrap(review).find(".show-read-more").invoke('text').its("length").should("be.lte", 213)
    //   })
    // })


  it('should show the next 3 reviews when more  reviews is clicked', () => {
    cy.contains("More Reviews").click()
    cy.get(".review").should("have.length", 4)
    cy.contains("Rating: 4").should("be.visible")
    cy.contains("Comment: this really sucks").should("be.visible")
  })
})

describe("cart", ()=>{
  
  
  it("should be visible", () => {
    cy.contains("button", "Add To Cart").should("be.visible")
  })

  it("should be visible", () => {
    cy.contains("Cart Total: 0").should("be.visible")
  })

  it("should redirect to login when click if not logeed in", () => {
    cy.contains("button", "Add To Cart").click()
    cy.url().should('be.equal', 'http://localhost:3000/login-page')
  })





})


describe("review form",()=>{
  it("should have a review text area", ()=>{
    cy.get("#addReviewForm").contains("Type review").should("be.visible")
    cy.get("#addReviewForm").get("textarea[name='reviewText']").should("be.visible")
  })

  it("should have a rating feild", () => {
    cy.get("#addReviewForm").contains("Rating").should("be.visible")
    cy.get("#addReviewForm").find("input[type='number']").should("be.visible")
  })


  it("should have form validation missing both feilds",() =>{
    cy.get("#addReviewForm").get("input[type='submit']").click()
    cy.get("textarea[name='reviewText']").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill in this field.')
    })
  })


  it("should have form validation missing review text feild", () => {
    cy.get("#addReviewForm").find("input[type='number']").type("3")
    cy.get("#addReviewForm").get("input[type='submit']").click()
    cy.get("textarea[name='reviewText']").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill in this field.')
    })
  })

  it("should have form validation missing review rating feild", () => {
    cy.get("#addReviewForm").get("textarea[name='reviewText']").type("this is a review")
    cy.get("#addReviewForm").get("input[type='submit']").click()
    cy.get("input[type='number']").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill in this field.')
    })
  })
  it("should display an alert if submiting and not logged in", () => {
    cy.get("#addReviewForm").get("textarea[name='reviewText']").type("this is a review")
    cy.get("#addReviewForm").find("input[type='number']").type("3")
    cy.get("#addReviewForm").get("input[type='submit']").click()
    cy.on('window:alert',(alert)=>{
      expect(alert).to.contains("Must be signed in to add review");
    })

  })

})