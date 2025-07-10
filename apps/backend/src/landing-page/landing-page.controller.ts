import { Controller, Get, Post, Body } from '@nestjs/common';

export interface LandingPageSection {
  title?: string;
  subtitle?: string;
  content?: string;
}

export interface LandingPageData {
  title?: string;
  subtitle?: string;
  bannerImageUrl?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  sections?: LandingPageSection[];
}

const landingPageData: LandingPageData = {
  title: 'Welcome to Bunder Shop',
  subtitle: 'Your one-stop e-commerce store',
  bannerImageUrl: '/assets/banner.jpg',
  ctaButtonText: 'Shop Now',
  ctaButtonLink: '/products',
  sections: [
    {
      title: 'Featured Deals',
      subtitle: 'Best prices for you',
      content: 'Check out our daily deals on popular products.',
    },
  ],
};

@Controller('landing-page')
export class LandingPageController {
  @Get()
  getLandingPage(): LandingPageData {
    return landingPageData;
  }

  @Post()
  updateLandingPage(@Body() updatedData: LandingPageData): LandingPageData {
    // TODO: persist updatedData if needed
    return updatedData;
  }
}
