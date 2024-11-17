"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recorderOverviewData = exports.adminOverviewData = exports.deleteBloodBank = exports.getAllBloodBanks = exports.getBloodBank = exports.updateBloodBank = exports.createBloodBank = void 0;
const date_fns_1 = require("date-fns"); // For handling date manipulations
const AsyncWrapper_1 = __importDefault(require("../middlewares/AsyncWrapper"));
const client_1 = __importDefault(require("../db/client"));
exports.createBloodBank = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bloodBank = yield client_1.default.bloodBank.create({
        data: {
            name: req.body.name,
            googleLocation: req.body.googleLocation,
            phone: req.body.phone,
            email: req.body.email,
            province: req.body.province,
            town: req.body.town,
            POBox: req.body.POBox
        }
    });
    res.status(201).json({ message: 'Blood bank created successfully', bloodBank });
}));
exports.updateBloodBank = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBloodBankData = yield client_1.default.bloodBank.findFirst({
        where: {
            id: req.query.id
        }
    });
    if (!existingBloodBankData) {
        return res.status(404).json({ message: 'Blood bank not found' });
    }
    const updatedData = {
        name: req.body.name || existingBloodBankData.name,
        googleLocation: req.body.googleLocation || existingBloodBankData.googleLocation,
        phone: req.body.phone || existingBloodBankData.phone,
        email: req.body.email || existingBloodBankData.email,
        province: req.body.province || existingBloodBankData.province,
        town: req.body.town || existingBloodBankData.town,
        POBox: req.body.POBox || existingBloodBankData.POBox,
        // Update Rh positive blood types
        rhP_O: req.body.rhP_O || existingBloodBankData.rhP_O,
        rhP_AB: req.body.rhP_AB || existingBloodBankData.rhP_AB,
        rhP_B: req.body.rhP_B || existingBloodBankData.rhP_B,
        rhP_A: req.body.rhP_A || existingBloodBankData.rhP_A,
        // Update Rh negative blood types
        rhN_O: req.body.rhN_O || existingBloodBankData.rhN_O,
        rhN_AB: req.body.rhN_AB || existingBloodBankData.rhN_AB,
        rhN_B: req.body.rhN_B || existingBloodBankData.rhN_B,
        rhN_A: req.body.rhN_A || existingBloodBankData.rhN_A,
        // Update Plasma Rh positive types
        plasmaRhP_O: req.body.plasmaRhP_O || existingBloodBankData.plasmaRhP_O,
        plasmaRhP_AB: req.body.plasmaRhP_AB || existingBloodBankData.plasmaRhP_AB,
        plasmaRhP_B: req.body.plasmaRhP_B || existingBloodBankData.plasmaRhP_B,
        plasmaRhP_A: req.body.plasmaRhP_A || existingBloodBankData.plasmaRhP_A,
        // Update Plasma Rh negative types
        plasmaRhN_O: req.body.plasmaRhN_O || existingBloodBankData.plasmaRhN_O,
        plasmaRhN_AB: req.body.plasmaRhN_AB || existingBloodBankData.plasmaRhN_AB,
        plasmaRhN_B: req.body.plasmaRhN_B || existingBloodBankData.plasmaRhN_B,
        plasmaRhN_A: req.body.plasmaRhN_A || existingBloodBankData.plasmaRhN_A,
        // Update Platelet Rh positive types
        plateletRhP_O: req.body.plateletRhP_O || existingBloodBankData.plateletRhP_O,
        plateletRhP_AB: req.body.plateletRhP_AB || existingBloodBankData.plateletRhP_AB,
        plateletRhP_B: req.body.plateletRhP_B || existingBloodBankData.plateletRhP_B,
        plateletRhP_A: req.body.plateletRhP_A || existingBloodBankData.plateletRhP_A,
        // Update Platelet Rh negative types
        plateletRhN_O: req.body.plateletRhN_O || existingBloodBankData.plateletRhN_O,
        plateletRhN_AB: req.body.plateletRhN_AB || existingBloodBankData.plateletRhN_AB,
        plateletRhN_B: req.body.plateletRhN_B || existingBloodBankData.plateletRhN_B,
        plateletRhN_A: req.body.plateletRhN_A || existingBloodBankData.plateletRhN_A,
        // Update Red Blood Cells Rh positive types
        rbcP_O: req.body.rbcP_O || existingBloodBankData.rbcP_O,
        rbcP_AB: req.body.rbcP_AB || existingBloodBankData.rbcP_AB,
        rbcP_B: req.body.rbcP_B || existingBloodBankData.rbcP_B,
        rbcP_A: req.body.rbcP_A || existingBloodBankData.rbcP_A,
        // Update Red Blood Cells Rh negative types
        rbcN_O: req.body.rbcN_O || existingBloodBankData.rbcN_O,
        rbcN_AB: req.body.rbcN_AB || existingBloodBankData.rbcN_AB,
        rbcN_B: req.body.rbcN_B || existingBloodBankData.rbcN_B,
        rbcN_A: req.body.rbcN_A || existingBloodBankData.rbcN_A,
    };
    const bloodBank = yield client_1.default.bloodBank.update({
        where: { id: req.query.id },
        data: updatedData
    });
    res.status(200).json({ message: 'Blood bank updated successfully', bloodBank });
}));
exports.getBloodBank = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bloodBank = yield client_1.default.bloodBank.findFirst({ where: { id: req.query.id } });
    if (!bloodBank) {
        return res.status(404).json({ message: 'Blood bank not found' });
    }
    res.status(200).json({ bloodBank });
}));
exports.getAllBloodBanks = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bloodBanks = yield client_1.default.bloodBank.findMany();
    res.status(200).json({ bloodBanks });
}));
exports.deleteBloodBank = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.bloodBank.delete({ where: { id: req.query.id } });
    res.status(200).json({ message: 'Blood bank deleted successfully' });
}));
exports.adminOverviewData = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bloodBankId = req.query.id;
    const hospitals = yield client_1.default.hospital.findMany({ where: { accessStatus: "Active" } });
    const applications = yield client_1.default.hospital.findMany({ where: { accessStatus: "Inactive" } });
    const bloodBankUsers = yield client_1.default.bloodBankRecorder.findMany({ where: { bloodBankId: bloodBankId } });
    const notifications = yield client_1.default.notification.findMany({ where: { type: 'Hospital Application' } });
    res.status(200).json({ hospitals, applications, notifications, users: bloodBankUsers });
}));
exports.recorderOverviewData = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bloodBankId = req.query.id;
    // Extract filters from the query parameters
    const { month, year, startDate, endDate } = req.query;
    // Set default values for the current month and year
    const now = new Date();
    const selectedMonth = month ? Number(month) : undefined; // JS months are 0-based
    const selectedYear = year ? Number(year) : now.getFullYear();
    // Function to count requests per day or month for chart data
    const countRequestsForChart = (requests, groupBy) => {
        if (groupBy === 'month') {
            // Group requests by month
            const monthCounts = Array.from({ length: 12 }, (_, i) => ({
                month: (0, date_fns_1.format)(new Date(selectedYear, i), 'MMMM'),
                request: 0,
            }));
            requests.forEach(request => {
                const month = new Date(request.createdAt).getMonth();
                monthCounts[month].request += 1;
            });
            return monthCounts;
        }
        else {
            // Group requests by day
            const daysInSelectedMonth = (0, date_fns_1.getDaysInMonth)(new Date(selectedYear, selectedMonth));
            const dayCounts = Array.from({ length: daysInSelectedMonth }, (_, i) => ({
                day: (i + 1).toString(),
                request: 0,
            }));
            requests.forEach(request => {
                const day = new Date(request.createdAt).getDate() - 1;
                dayCounts[day].request += 1;
            });
            return dayCounts;
        }
    };
    // Fetch requests based on the selected date range
    let requestsReceived;
    let chartData = [];
    let startOfYear = new Date(selectedYear, 0, 1);
    let endOfYear = new Date(selectedYear, 11, 31);
    let dateRangeStart;
    let dateRangeEnd;
    if (selectedMonth === undefined) {
        // No specific month, get data for the entire year
        dateRangeStart = startOfYear;
        dateRangeEnd = endOfYear;
        requestsReceived = yield client_1.default.bloodRequest.findMany({
            where: {
                bloodBankId: bloodBankId,
                createdAt: {
                    gte: dateRangeStart,
                    lte: dateRangeEnd,
                }
            },
            include: {
                bloodBank: true,
                hospital: true,
                otherHospital: true
            }
        });
        // Group requests by month for chart data
        chartData = countRequestsForChart(requestsReceived, 'month');
    }
    else {
        // A specific month is selected
        dateRangeStart = (0, date_fns_1.startOfMonth)(new Date(selectedYear, selectedMonth));
        dateRangeEnd = (0, date_fns_1.endOfMonth)(new Date(selectedYear, selectedMonth));
        requestsReceived = yield client_1.default.bloodRequest.findMany({
            where: {
                bloodBankId: bloodBankId,
                createdAt: {
                    gte: dateRangeStart,
                    lte: dateRangeEnd,
                },
            },
            include: {
                bloodBank: true,
                hospital: true,
                otherHospital: true
            }
        });
        // Group requests by day for chart data
        chartData = countRequestsForChart(requestsReceived, 'day');
    }
    // Fetch blood bags in the blood bank within the date range
    const allBloodBagsInBloodBank = yield client_1.default.bloodBag.findMany({
        where: {
            bloodBankId: bloodBankId,
            createdAt: {
                gte: dateRangeStart,
                lte: dateRangeEnd,
            },
        },
        orderBy: {
            createdAt: 'asc', // Sort by creation date (ascending)
        },
    });
    // Blood Bank
    const bloodBank = yield client_1.default.bloodBank.findFirst({
        where: {
            id: bloodBankId
        },
        include: {
            bloodOutTransactions: true,
            notifications: true,
        }
    });
    // Send response
    res.status(200).json({
        requests: requestsReceived,
        bloodBags: allBloodBagsInBloodBank,
        bloodBank: bloodBank,
        bloodOutTransactions: bloodBank === null || bloodBank === void 0 ? void 0 : bloodBank.bloodOutTransactions,
        notifications: bloodBank === null || bloodBank === void 0 ? void 0 : bloodBank.notifications,
        chartData: chartData,
        filters: {
            month: selectedMonth !== undefined ? selectedMonth : undefined, // Convert 0-based month back to 1-based
            year: selectedYear,
            dateRangeStart,
            dateRangeEnd,
        },
    });
}));
