
import { UserTest } from "./User";


describe("start", () => {

    it('Should return false if age of user is under 13', () => {

        const user = new UserTest("mats2@live.fr", "Laila", 'Charaoui', "blabla", "2000/10/15");
        expect(user.isValid()).toBe(false);

    })


});