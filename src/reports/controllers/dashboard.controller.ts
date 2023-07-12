import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "../services";

@Controller('report/dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) {}

    @Get('statistics')
    async dashboardStatistics() {
        return await this.dashboardService.dashboardStatistics();
    }

    @Get('top-products')
    async dashboardTopProducts() {
        return await this.dashboardService.dashboardTopProducts();
    }

    @Get('sales-time-series')
    async dashboardSalesTimeSeries() {
        return await this.dashboardService.dashboardSalesTimeSeries();
    }
}