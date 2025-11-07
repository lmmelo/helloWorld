#!/usr/bin/env python3
"""
Block Breaker Game
A classic Breakout-style arcade game built with pygame.
Use arrow keys to move the paddle and break all the blocks!
"""

import pygame
import sys
import random

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (220, 50, 50)
GREEN = (50, 220, 50)
BLUE = (50, 50, 220)
YELLOW = (220, 220, 50)
PURPLE = (180, 50, 220)
ORANGE = (255, 140, 0)
CYAN = (0, 200, 200)

# Paddle settings
PADDLE_WIDTH = 120
PADDLE_HEIGHT = 15
PADDLE_SPEED = 8

# Ball settings
BALL_SIZE = 12
BALL_SPEED_X = 5
BALL_SPEED_Y = -5

# Block settings
BLOCK_WIDTH = 75
BLOCK_HEIGHT = 30
BLOCK_ROWS = 6
BLOCK_COLS = 10
BLOCK_PADDING = 5
BLOCK_OFFSET_TOP = 80


class Paddle:
    def __init__(self):
        self.width = PADDLE_WIDTH
        self.height = PADDLE_HEIGHT
        self.x = SCREEN_WIDTH // 2 - self.width // 2
        self.y = SCREEN_HEIGHT - 50
        self.speed = PADDLE_SPEED
        self.rect = pygame.Rect(self.x, self.y, self.width, self.height)

    def move(self, direction):
        if direction == "left" and self.x > 0:
            self.x -= self.speed
        elif direction == "right" and self.x < SCREEN_WIDTH - self.width:
            self.x += self.speed
        self.rect.x = self.x

    def draw(self, screen):
        pygame.draw.rect(screen, WHITE, self.rect)
        pygame.draw.rect(screen, CYAN, self.rect, 3)


class Ball:
    def __init__(self):
        self.size = BALL_SIZE
        self.reset()

    def reset(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT // 2
        self.speed_x = BALL_SPEED_X * random.choice([-1, 1])
        self.speed_y = BALL_SPEED_Y
        self.rect = pygame.Rect(self.x, self.y, self.size, self.size)

    def move(self):
        self.x += self.speed_x
        self.y += self.speed_y
        self.rect.x = self.x
        self.rect.y = self.y

        # Bounce off walls
        if self.x <= 0 or self.x >= SCREEN_WIDTH - self.size:
            self.speed_x *= -1

        # Bounce off top
        if self.y <= 0:
            self.speed_y *= -1

    def draw(self, screen):
        pygame.draw.circle(screen, WHITE, (int(self.x + self.size // 2),
                                           int(self.y + self.size // 2)),
                          self.size // 2)
        pygame.draw.circle(screen, YELLOW, (int(self.x + self.size // 2),
                                            int(self.y + self.size // 2)),
                          self.size // 2 - 2)

    def is_out_of_bounds(self):
        return self.y > SCREEN_HEIGHT


class Block:
    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.width = BLOCK_WIDTH
        self.height = BLOCK_HEIGHT
        self.color = color
        self.rect = pygame.Rect(x, y, self.width, self.height)
        self.active = True

    def draw(self, screen):
        if self.active:
            pygame.draw.rect(screen, self.color, self.rect)
            pygame.draw.rect(screen, BLACK, self.rect, 2)


class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Block Breaker")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)
        self.reset_game()

    def reset_game(self):
        self.paddle = Paddle()
        self.ball = Ball()
        self.blocks = []
        self.score = 0
        self.lives = 3
        self.game_over = False
        self.won = False
        self.create_blocks()

    def create_blocks(self):
        colors = [RED, ORANGE, YELLOW, GREEN, CYAN, PURPLE]
        for row in range(BLOCK_ROWS):
            for col in range(BLOCK_COLS):
                x = col * (BLOCK_WIDTH + BLOCK_PADDING) + BLOCK_PADDING + 10
                y = row * (BLOCK_HEIGHT + BLOCK_PADDING) + BLOCK_OFFSET_TOP
                color = colors[row % len(colors)]
                self.blocks.append(Block(x, y, color))

    def handle_collisions(self):
        # Paddle collision
        if self.ball.rect.colliderect(self.paddle.rect):
            # Make ball bounce based on where it hits the paddle
            hit_pos = (self.ball.x - self.paddle.x) / self.paddle.width
            self.ball.speed_x = (hit_pos - 0.5) * 10
            self.ball.speed_y *= -1
            self.ball.y = self.paddle.y - self.ball.size

        # Block collision
        for block in self.blocks:
            if block.active and self.ball.rect.colliderect(block.rect):
                block.active = False
                self.score += 10

                # Determine which side of the block was hit
                ball_center_x = self.ball.x + self.ball.size / 2
                ball_center_y = self.ball.y + self.ball.size / 2
                block_center_x = block.x + block.width / 2
                block_center_y = block.y + block.height / 2

                # Simple bounce logic
                if abs(ball_center_x - block_center_x) > abs(ball_center_y - block_center_y):
                    self.ball.speed_x *= -1
                else:
                    self.ball.speed_y *= -1

                break

    def check_win_condition(self):
        return all(not block.active for block in self.blocks)

    def draw(self):
        self.screen.fill(BLACK)

        # Draw game elements
        self.paddle.draw(self.screen)
        self.ball.draw(self.screen)

        for block in self.blocks:
            block.draw(self.screen)

        # Draw score and lives
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        lives_text = self.font.render(f"Lives: {self.lives}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        self.screen.blit(lives_text, (SCREEN_WIDTH - 150, 10))

        # Draw game over or win message
        if self.game_over:
            game_over_text = self.font.render("GAME OVER!", True, RED)
            restart_text = self.small_font.render("Press SPACE to restart", True, WHITE)
            self.screen.blit(game_over_text,
                           (SCREEN_WIDTH // 2 - game_over_text.get_width() // 2,
                            SCREEN_HEIGHT // 2 - 50))
            self.screen.blit(restart_text,
                           (SCREEN_WIDTH // 2 - restart_text.get_width() // 2,
                            SCREEN_HEIGHT // 2))

        if self.won:
            win_text = self.font.render("YOU WIN!", True, GREEN)
            restart_text = self.small_font.render("Press SPACE to play again", True, WHITE)
            final_score = self.font.render(f"Final Score: {self.score}", True, YELLOW)
            self.screen.blit(win_text,
                           (SCREEN_WIDTH // 2 - win_text.get_width() // 2,
                            SCREEN_HEIGHT // 2 - 80))
            self.screen.blit(final_score,
                           (SCREEN_WIDTH // 2 - final_score.get_width() // 2,
                            SCREEN_HEIGHT // 2 - 30))
            self.screen.blit(restart_text,
                           (SCREEN_WIDTH // 2 - restart_text.get_width() // 2,
                            SCREEN_HEIGHT // 2 + 20))

        pygame.display.flip()

    def run(self):
        running = True

        while running:
            self.clock.tick(FPS)

            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE and (self.game_over or self.won):
                        self.reset_game()
                    if event.key == pygame.K_ESCAPE:
                        running = False

            if not self.game_over and not self.won:
                # Handle paddle movement
                keys = pygame.key.get_pressed()
                if keys[pygame.K_LEFT]:
                    self.paddle.move("left")
                if keys[pygame.K_RIGHT]:
                    self.paddle.move("right")

                # Move ball
                self.ball.move()

                # Handle collisions
                self.handle_collisions()

                # Check if ball fell off screen
                if self.ball.is_out_of_bounds():
                    self.lives -= 1
                    if self.lives <= 0:
                        self.game_over = True
                    else:
                        self.ball.reset()

                # Check win condition
                if self.check_win_condition():
                    self.won = True

            self.draw()

        pygame.quit()
        sys.exit()


if __name__ == "__main__":
    game = Game()
    game.run()
