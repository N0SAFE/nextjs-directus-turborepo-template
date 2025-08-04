import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { userContract } from '../contracts/user.contract';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Implement the entire user contract
   */
  @Implement(userContract)
  user() {
    return {
      // Get all users with pagination
      list: implement(userContract.list).handler(async ({ input }) => {
        return await this.userService.getUsers(input.query);
      }),

      // Find user by ID
      findById: implement(userContract.findById).handler(async ({ input }) => {
        return await this.userService.findUserById(input.params.id);
      }),

      // Create a new user
      create: implement(userContract.create).handler(async ({ input }) => {
        return await this.userService.createUser(input.json);
      }),

      // Update existing user
      update: implement(userContract.update).handler(async ({ input }) => {
        return await this.userService.updateUser(input.params.id, input.json);
      }),

      // Delete user
      delete: implement(userContract.delete).handler(async ({ input }) => {
        return await this.userService.deleteUser(input.params.id);
      }),

      // Check if email exists
      checkEmail: implement(userContract.checkEmail).handler(async ({ input }) => {
        return await this.userService.checkUserExistsByEmail(input.json.email);
      }),

      // Get user count
      count: implement(userContract.count).handler(async () => {
        return await this.userService.getUserCount();
      }),
    };
  }
}
