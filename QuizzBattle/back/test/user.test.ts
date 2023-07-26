import { Sequelize } from "sequelize";
import { generateVerificationLink } from "./your-module-file"; // Remplacez par le chemin de votre module
import User, { uptadePassword } from "./user"; // Remplacez par le chemin de votre module

describe("User Model", () => {
  let sequelize;
  let testUser;

  beforeAll(() => {
    // Initialisez une instance Sequelize pour les tests
    sequelize = new Sequelize("sqlite::memory:");
    // Ajoutez ici les options de connexion à votre base de données

    // Initialisez un utilisateur de test
    testUser = User.build({
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      password: "TestPassword123!",
    });
  });

  afterAll(async () => {
    // Fermez la connexion après les tests
    await sequelize.close();
  });

  it("should compare passwords correctly", async () => {
    const hashedPassword = await testUser.generateHashedPassword();
    const isPasswordCorrect = await testUser.checkPassword("TestPassword123!");
    const isIncorrectPasswordCorrect = await testUser.checkPassword(
      "IncorrectPassword"
    );

    expect(hashedPassword).toBeDefined();
    expect(isPasswordCorrect).toBe(true);
    expect(isIncorrectPasswordCorrect).toBe(false);
  });

  it("should generate a verification email", async () => {
    const sendVerificationEmailSpy = jest.spyOn(
      testUser,
      "sendVerificationEmail"
    );

    await testUser.sendVerificationEmail();

    expect(sendVerificationEmailSpy).toHaveBeenCalledTimes(1);
  });

  it("should update password with hash before creating", async () => {
    const user = User.build({
      firstname: "Jane",
      lastname: "Doe",
      email: "jane.doe@example.com",
      password: "AnotherPassword123!",
    });

    await user.save();

    expect(user.password).not.toBe("AnotherPassword123!"); // Le mot de passe ne doit pas être stocké en clair
  });

  it("should generate verification link", () => {
    const userId = 123;
    const verificationLink = generateVerificationLink(userId);

    expect(verificationLink).toContain(String(userId));
  });

  it('should have default role "user"', () => {
    expect(testUser.role).toBe("user");
  });

  it('should have default value "false" for "isVerified"', () => {
    expect(testUser.isVerified).toBe(false);
  });

  // Ajoutez d'autres tests ici pour vos fonctions ou méthodes

  it('should have timestamps "createdAt" and "updatedAt"', () => {
    expect(testUser.createdAt).toBeDefined();
    expect(testUser.updatedAt).toBeDefined();
  });

  it("should trigger sendVerificationEmail hook after create", async () => {
    const sendVerificationEmailSpy = jest.spyOn(
      testUser,
      "sendVerificationEmail"
    );
    await testUser.save();

    expect(sendVerificationEmailSpy).toHaveBeenCalledTimes(1);
  });

  // Testez les validations ici, par exemple pour l'email et le mot de passe
});
