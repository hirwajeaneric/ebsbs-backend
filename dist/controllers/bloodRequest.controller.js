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
exports.deleteRequest = exports.findRequestsByBloodBankId = exports.findReceivedRequestsByHospitalId = exports.findRequestsByHospitalId = exports.findRequestById = exports.updateBloodRequest = exports.listAllRequests = exports.createRequest = void 0;
const AsyncWrapper_1 = __importDefault(require("../middlewares/AsyncWrapper"));
const client_1 = __importDefault(require("../db/client"));
exports.createRequest = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { hospitalId, idOfOtherHospital, bloodBankId, rhP_O, rhP_A, rhP_B, rhP_AB, rhN_O, rhN_A, rhN_B, rhN_AB, plasmaRhP_O, plasmaRhP_A, plasmaRhP_B, plasmaRhP_AB, plasmaRhN_O, plasmaRhN_A, plasmaRhN_B, plasmaRhN_AB, plateletRhP_O, plateletRhP_A, plateletRhP_B, plateletRhP_AB, plateletRhN_O, plateletRhN_A, plateletRhN_B, plateletRhN_AB, rbcP_O, rbcP_A, rbcP_B, rbcP_AB, rbcN_O, rbcN_A, rbcN_B, rbcN_AB } = req.body;
    // Validate input - Add additional validation if necessary
    if (!hospitalId) {
        return res.status(400).json({ message: 'Hospital ID is required' });
    }
    // Create blood request
    const bloodRequest = yield client_1.default.bloodRequest.create({
        data: {
            hospitalId: hospitalId,
            idOfOtherHospital: idOfOtherHospital || null,
            bloodBankId: bloodBankId || null,
            rhP_O: Number(rhP_O) || 0,
            rhP_A: Number(rhP_A) || 0,
            rhP_B: Number(rhP_B) || 0,
            rhP_AB: Number(rhP_AB) || 0,
            rhN_O: Number(rhN_O) || 0,
            rhN_A: Number(rhN_A) || 0,
            rhN_B: Number(rhN_B) || 0,
            rhN_AB: Number(rhN_AB) || 0,
            plasmaRhP_O: Number(plasmaRhP_O) || 0,
            plasmaRhP_A: Number(plasmaRhP_A) || 0,
            plasmaRhP_B: Number(plasmaRhP_B) || 0,
            plasmaRhP_AB: Number(plasmaRhP_AB) || 0,
            plasmaRhN_O: Number(plasmaRhN_O) || 0,
            plasmaRhN_A: Number(plasmaRhN_A) || 0,
            plasmaRhN_B: Number(plasmaRhN_B) || 0,
            plasmaRhN_AB: Number(plasmaRhN_AB) || 0,
            plateletRhP_O: Number(plateletRhP_O) || 0,
            plateletRhP_A: Number(plateletRhP_A) || 0,
            plateletRhP_B: Number(plateletRhP_B) || 0,
            plateletRhP_AB: Number(plateletRhP_AB) || 0,
            plateletRhN_O: Number(plateletRhN_O) || 0,
            plateletRhN_A: Number(plateletRhN_A) || 0,
            plateletRhN_B: Number(plateletRhN_B) || 0,
            plateletRhN_AB: Number(plateletRhN_AB) || 0,
            rbcP_O: Number(rbcP_O) || 0,
            rbcP_A: Number(rbcP_A) || 0,
            rbcP_B: Number(rbcP_B) || 0,
            rbcP_AB: Number(rbcP_AB) || 0,
            rbcN_O: Number(rbcN_O) || 0,
            rbcN_A: Number(rbcN_A) || 0,
            rbcN_B: Number(rbcN_B) || 0,
            rbcN_AB: Number(rbcN_AB) || 0,
            status: "Pending", // Default status is "pending"
        },
        include: {
            hospital: true,
        }
    });
    if (!bloodRequest) {
        return res.status(500).json({ message: 'Failed to create blood request' });
    }
    // Notification managment 
    var message = "";
    let hospitalThatSentRequest = yield client_1.default.hospital.findFirst({ where: { id: bloodBankId } });
    let hospitalToReceiveRequest = null;
    let bloodBankToReceiveRequest = null;
    let receivingHospitalId = null;
    let receivingHospitalName = null;
    let receivingBloodBankId = null;
    let receivingBloodBankName = null;
    let link = null;
    if (bloodRequest.idOfOtherHospital !== null) {
        hospitalToReceiveRequest = yield client_1.default.hospital.findFirst({ where: { id: bloodRequest.idOfOtherHospital } });
        message = `New Blood Request received from ${(_a = bloodRequest.hospital) === null || _a === void 0 ? void 0 : _a.name}. \nClick on the link bellow to view details`;
        link = `${process.env.CLIENT_URL}/hdash/${(_b = bloodRequest.hospital) === null || _b === void 0 ? void 0 : _b.id}/r/requests/incoming/${bloodRequest.id}`;
        receivingHospitalId = hospitalToReceiveRequest === null || hospitalToReceiveRequest === void 0 ? void 0 : hospitalToReceiveRequest.id;
        receivingHospitalName = hospitalToReceiveRequest === null || hospitalToReceiveRequest === void 0 ? void 0 : hospitalToReceiveRequest.name;
    }
    else if (bloodRequest.bloodBankId !== null) {
        bloodBankToReceiveRequest = yield client_1.default.bloodBank.findFirst({ where: { id: bloodRequest.bloodBankId } });
        message = `New Blood Request received from ${hospitalThatSentRequest === null || hospitalThatSentRequest === void 0 ? void 0 : hospitalThatSentRequest.name}. \nClick on the link bellow to view details`;
        link = `${process.env.CLIENT_URL}/dashboard/r/requests/${bloodRequest.id}`;
        receivingBloodBankId = bloodBankToReceiveRequest === null || bloodBankToReceiveRequest === void 0 ? void 0 : bloodBankToReceiveRequest.id;
        receivingBloodBankName = bloodBankToReceiveRequest === null || bloodBankToReceiveRequest === void 0 ? void 0 : bloodBankToReceiveRequest.name;
    }
    yield client_1.default.notification.create({
        data: {
            title: "New Blood Request Request Alert",
            content: message,
            sendingHospitalName: hospitalThatSentRequest === null || hospitalThatSentRequest === void 0 ? void 0 : hospitalThatSentRequest.name,
            sendingHospitalId: hospitalThatSentRequest === null || hospitalThatSentRequest === void 0 ? void 0 : hospitalThatSentRequest.id,
            receivingBloodBankName: receivingBloodBankName,
            receivingBloodBankId: receivingBloodBankId,
            receivingHospitalName: receivingHospitalName,
            receivingHospitalId: receivingHospitalId,
            type: "Blood Request",
            status: "Unseen",
            link: link
        }
    });
    res.status(201).json({ message: 'Blood Request Sent', bloodRequest });
}));
exports.listAllRequests = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all blood requests from the database
    const bloodRequests = yield client_1.default.bloodRequest.findMany();
    // Check if there are any requests
    if (bloodRequests.length === 0) {
        return res.status(404).json({ message: 'No blood requests found' });
    }
    // Return the list of blood requests
    res.status(200).json({ bloodRequests });
}));
exports.updateBloodRequest = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const { status, bloodBankId, idOfOtherHospital, rhP_O, rhP_A, rhP_B, rhP_AB, rhN_O, rhN_A, rhN_B, rhN_AB, plasmaRhP_O, plasmaRhP_A, plasmaRhP_B, plasmaRhP_AB, plasmaRhN_O, plasmaRhN_A, plasmaRhN_B, plasmaRhN_AB, plateletRhP_O, plateletRhP_A, plateletRhP_B, plateletRhP_AB, plateletRhN_O, plateletRhN_A, plateletRhN_B, plateletRhN_AB, rbcP_O, rbcP_A, rbcP_B, rbcP_AB, rbcN_O, rbcN_A, rbcN_B, rbcN_AB } = req.body;
    // Find the blood request by ID
    const existingBloodRequest = yield client_1.default.bloodRequest.findUnique({ where: { id: id } });
    if (!existingBloodRequest) {
        return res.status(404).json({ message: 'Blood request not found' });
    }
    // Update the status of the blood request
    const updatedRequest = yield client_1.default.bloodRequest.update({
        where: { id: id },
        data: {
            status: status || existingBloodRequest.status,
            rhP_O: Number(rhP_O) || existingBloodRequest.rhP_O,
            rhP_A: Number(rhP_A) || existingBloodRequest.rhP_A,
            rhP_B: Number(rhP_B) || existingBloodRequest.rhP_B,
            rhP_AB: Number(rhP_AB) || existingBloodRequest.rhP_AB,
            rhN_O: Number(rhN_O) || existingBloodRequest.rhN_O,
            rhN_A: Number(rhN_A) || existingBloodRequest.rhN_A,
            rhN_B: Number(rhN_B) || existingBloodRequest.rhN_B,
            rhN_AB: Number(rhN_AB) || existingBloodRequest.rhN_AB,
            plasmaRhP_O: Number(plasmaRhP_O) || existingBloodRequest.plasmaRhP_O,
            plasmaRhP_A: Number(plasmaRhP_A) || existingBloodRequest.plasmaRhP_A,
            plasmaRhP_B: Number(plasmaRhP_B) || existingBloodRequest.plasmaRhP_B,
            plasmaRhP_AB: Number(plasmaRhP_AB) || existingBloodRequest.plasmaRhP_AB,
            plasmaRhN_O: Number(plasmaRhN_O) || existingBloodRequest.plasmaRhN_O,
            plasmaRhN_A: Number(plasmaRhN_A) || existingBloodRequest.plasmaRhN_A,
            plasmaRhN_B: Number(plasmaRhN_B) || existingBloodRequest.plasmaRhN_B,
            plasmaRhN_AB: Number(plasmaRhN_AB) || existingBloodRequest.plasmaRhN_AB,
            plateletRhP_O: Number(plateletRhP_O) || existingBloodRequest.plateletRhP_O,
            plateletRhP_A: Number(plateletRhP_A) || existingBloodRequest.plateletRhP_A,
            plateletRhP_B: Number(plateletRhP_B) || existingBloodRequest.plateletRhP_B,
            plateletRhP_AB: Number(plateletRhP_AB) || existingBloodRequest.plateletRhP_AB,
            plateletRhN_O: Number(plateletRhN_O) || existingBloodRequest.plateletRhN_O,
            plateletRhN_A: Number(plateletRhN_A) || existingBloodRequest.plateletRhN_A,
            plateletRhN_B: Number(plateletRhN_B) || existingBloodRequest.plateletRhN_B,
            plateletRhN_AB: Number(plateletRhN_AB) || existingBloodRequest.plateletRhN_AB,
            rbcP_O: Number(rbcP_O) || existingBloodRequest.rbcP_O,
            rbcP_A: Number(rbcP_A) || existingBloodRequest.rbcP_A,
            rbcP_B: Number(rbcP_B) || existingBloodRequest.rbcP_B,
            rbcP_AB: Number(rbcP_AB) || existingBloodRequest.rbcP_AB,
            rbcN_O: Number(rbcN_O) || existingBloodRequest.rbcN_O,
            rbcN_A: Number(rbcN_A) || existingBloodRequest.rbcN_A,
            rbcN_B: Number(rbcN_B) || existingBloodRequest.rbcN_B,
            rbcN_AB: Number(rbcN_AB) || existingBloodRequest.rbcN_AB,
        }
    });
    // if ((existingBloodRequest.status === "Pending" || status === "Recieved/In Process") && status === "Delivered") {
    //     const bloodTypesToTransfer = [
    //         { type: "Whole Blood", group: "O", rhesis: "N", quantity: existingBloodRequest.rhN_O },
    //         { type: "Whole Blood", group: "A", rhesis: "N", quantity: existingBloodRequest.rhN_A },
    //         { type: "Whole Blood", group: "B", rhesis: "N", quantity: existingBloodRequest.rhN_B },
    //         { type: "Whole Blood", group: "AB", rhesis: "N", quantity: existingBloodRequest.rhN_AB },
    //         { type: "Whole Blood", group: "O", rhesis: "P", quantity: existingBloodRequest.rhP_O },
    //         { type: "Whole Blood", group: "A", rhesis: "P", quantity: existingBloodRequest.rhP_A },
    //         { type: "Whole Blood", group: "B", rhesis: "P", quantity: existingBloodRequest.rhP_B },
    //         { type: "Whole Blood", group: "AB", rhesis: "P", quantity: existingBloodRequest.rhP_AB },
    //         { type: "Plasma", group: "O", rhesis: "N", quantity: existingBloodRequest.plasmaRhN_O },
    //         { type: "Plasma", group: "A", rhesis: "N", quantity: existingBloodRequest.plasmaRhN_A },
    //         { type: "Plasma", group: "B", rhesis: "N", quantity: existingBloodRequest.plasmaRhN_B },
    //         { type: "Plasma", group: "AB", rhesis: "N", quantity: existingBloodRequest.plasmaRhN_AB },
    //         { type: "Plasma", group: "O", rhesis: "P", quantity: existingBloodRequest.plasmaRhP_O },
    //         { type: "Plasma", group: "A", rhesis: "P", quantity: existingBloodRequest.plasmaRhP_A },
    //         { type: "Plasma", group: "B", rhesis: "P", quantity: existingBloodRequest.plasmaRhP_B },
    //         { type: "Plasma", group: "AB", rhesis: "P", quantity: existingBloodRequest.plasmaRhP_AB },
    //         { type: "Platelet", group: "O", rhesis: "N", quantity: existingBloodRequest.plateletRhN_O },
    //         { type: "Platelet", group: "A", rhesis: "N", quantity: existingBloodRequest.plateletRhN_A },
    //         { type: "Platelet", group: "B", rhesis: "N", quantity: existingBloodRequest.plateletRhN_B },
    //         { type: "Platelet", group: "AB", rhesis: "N", quantity: existingBloodRequest.plateletRhN_AB },
    //         { type: "Platelet", group: "O", rhesis: "P", quantity: existingBloodRequest.plateletRhP_O },
    //         { type: "Platelet", group: "A", rhesis: "P", quantity: existingBloodRequest.plateletRhP_A },
    //         { type: "Platelet", group: "B", rhesis: "P", quantity: existingBloodRequest.plateletRhP_B },
    //         { type: "Platelet", group: "AB", rhesis: "P", quantity: existingBloodRequest.plateletRhP_AB },
    //         { type: "Red Cells", group: "O", rhesis: "N", quantity: existingBloodRequest.rbcN_O },
    //         { type: "Red Cells", group: "A", rhesis: "N", quantity: existingBloodRequest.rbcN_A },
    //         { type: "Red Cells", group: "B", rhesis: "N", quantity: existingBloodRequest.rbcN_B },
    //         { type: "Red Cells", group: "AB", rhesis: "N", quantity: existingBloodRequest.rbcN_AB },
    //         { type: "Red Cells", group: "O", rhesis: "P", quantity: existingBloodRequest.rbcP_O },
    //         { type: "Red Cells", group: "A", rhesis: "P", quantity: existingBloodRequest.rbcP_A },
    //         { type: "Red Cells", group: "B", rhesis: "P", quantity: existingBloodRequest.rbcP_B },
    //         { type: "Red Cells", group: "AB", rhesis: "P", quantity: existingBloodRequest.rbcP_AB }
    //     ];
    //     for (const bloodType of bloodTypesToTransfer) {
    //         if (bloodType.quantity > 0) {
    //             const bloodBags = await prisma.bloodBag.findMany({
    //                 where: {
    //                     bloodType: bloodType.type,
    //                     bloodGroup: bloodType.group,
    //                     rhesis: bloodType.rhesis,
    //                     transfered: false,
    //                     bloodBankId: bloodBankId
    //                 },
    //                 take: bloodType.quantity
    //             });
    //             if (bloodBags.length < bloodType.quantity) {
    //                 return res.status(400).json({ message: `Insufficient blood bags for ${bloodType.type} ${bloodType.group} ${bloodType.rhesis}` });
    //             }
    //             await prisma.bloodBag.updateMany({
    //                 where: {
    //                     id: { in: bloodBags.map(bag => bag.id) }
    //                 },
    //                 data: {
    //                     hospitalId: updatedRequest.hospitalId,
    //                     transfered: true
    //                 }
    //             });
    //         }
    //     }
    // }
    // Check if the status is set to "Delivered"
    if ((existingBloodRequest.status === "Pending" || status === "Recieved/In Process") && status === "Delivered") {
        const hospitalId = existingBloodRequest.hospitalId;
        const hospital = yield client_1.default.hospital.findUnique({ where: { id: hospitalId } });
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        // Create a new BloodOutTransaction
        yield client_1.default.bloodOutTransaction.create({
            data: {
                bloodBankId: bloodBankId,
                hospitalId: hospitalId,
                rhP_O: existingBloodRequest.rhP_O,
                rhP_A: existingBloodRequest.rhP_A,
                rhP_B: existingBloodRequest.rhP_B,
                rhP_AB: existingBloodRequest.rhP_AB,
                rhN_O: existingBloodRequest.rhN_O,
                rhN_A: existingBloodRequest.rhN_A,
                rhN_B: existingBloodRequest.rhN_B,
                rhN_AB: existingBloodRequest.rhN_AB,
                plasmaRhP_O: existingBloodRequest.plasmaRhP_O,
                plasmaRhP_A: existingBloodRequest.plasmaRhP_A,
                plasmaRhP_B: existingBloodRequest.plasmaRhP_B,
                plasmaRhP_AB: existingBloodRequest.plasmaRhP_AB,
                plasmaRhN_O: existingBloodRequest.plasmaRhN_O,
                plasmaRhN_A: existingBloodRequest.plasmaRhN_A,
                plasmaRhN_B: existingBloodRequest.plasmaRhN_B,
                plasmaRhN_AB: existingBloodRequest.plasmaRhN_AB,
                plateletRhP_O: existingBloodRequest.plateletRhP_O,
                plateletRhP_A: existingBloodRequest.plateletRhP_A,
                plateletRhP_B: existingBloodRequest.plateletRhP_B,
                plateletRhP_AB: existingBloodRequest.plateletRhP_AB,
                plateletRhN_O: existingBloodRequest.plateletRhN_O,
                plateletRhN_A: existingBloodRequest.plateletRhN_A,
                plateletRhN_B: existingBloodRequest.plateletRhN_B,
                plateletRhN_AB: existingBloodRequest.plateletRhN_AB,
                rbcP_O: existingBloodRequest.rbcP_O,
                rbcP_A: existingBloodRequest.rbcP_A,
                rbcP_B: existingBloodRequest.rbcP_B,
                rbcP_AB: existingBloodRequest.rbcP_AB,
                rbcN_O: existingBloodRequest.rbcN_O,
                rbcN_A: existingBloodRequest.rbcN_A,
                rbcN_B: existingBloodRequest.rbcN_B,
                rbcN_AB: existingBloodRequest.rbcN_AB,
            }
        });
        // Create a new BloodInTransaction
        yield client_1.default.bloodInTransaction.create({
            data: {
                hospitalId: hospitalId,
                rhP_O: existingBloodRequest.rhP_O,
                rhP_A: existingBloodRequest.rhP_A,
                rhP_B: existingBloodRequest.rhP_B,
                rhP_AB: existingBloodRequest.rhP_AB,
                rhN_O: existingBloodRequest.rhN_O,
                rhN_A: existingBloodRequest.rhN_A,
                rhN_B: existingBloodRequest.rhN_B,
                rhN_AB: existingBloodRequest.rhN_AB,
                plasmaRhP_O: existingBloodRequest.plasmaRhP_O,
                plasmaRhP_A: existingBloodRequest.plasmaRhP_A,
                plasmaRhP_B: existingBloodRequest.plasmaRhP_B,
                plasmaRhP_AB: existingBloodRequest.plasmaRhP_AB,
                plasmaRhN_O: existingBloodRequest.plasmaRhN_O,
                plasmaRhN_A: existingBloodRequest.plasmaRhN_A,
                plasmaRhN_B: existingBloodRequest.plasmaRhN_B,
                plasmaRhN_AB: existingBloodRequest.plasmaRhN_AB,
                plateletRhP_O: existingBloodRequest.plateletRhP_O,
                plateletRhP_A: existingBloodRequest.plateletRhP_A,
                plateletRhP_B: existingBloodRequest.plateletRhP_B,
                plateletRhP_AB: existingBloodRequest.plateletRhP_AB,
                plateletRhN_O: existingBloodRequest.plateletRhN_O,
                plateletRhN_A: existingBloodRequest.plateletRhN_A,
                plateletRhN_B: existingBloodRequest.plateletRhN_B,
                plateletRhN_AB: existingBloodRequest.plateletRhN_AB,
                rbcP_O: existingBloodRequest.rbcP_O,
                rbcP_A: existingBloodRequest.rbcP_A,
                rbcP_B: existingBloodRequest.rbcP_B,
                rbcP_AB: existingBloodRequest.rbcP_AB,
                rbcN_O: existingBloodRequest.rbcN_O,
                rbcN_A: existingBloodRequest.rbcN_A,
                rbcN_B: existingBloodRequest.rbcN_B,
                rbcN_AB: existingBloodRequest.rbcN_AB,
                requestId: existingBloodRequest.id
            }
        });
        // Update BloodBank Stock by deducting
        if (existingBloodRequest.bloodBankId && existingBloodRequest.bloodBankId.length > 0) {
            const bloodBank = yield client_1.default.bloodBank.findUnique({ where: { id: bloodBankId } });
            if (!bloodBank) {
                throw new Error("Invalid blood bank ID");
            }
            yield client_1.default.bloodBank.update({
                where: { id: bloodBankId },
                data: {
                    rhP_O: bloodBank.rhP_O - existingBloodRequest.rhP_O,
                    rhP_A: bloodBank.rhP_A - existingBloodRequest.rhP_A,
                    rhP_B: bloodBank.rhP_B - existingBloodRequest.rhP_B,
                    rhP_AB: bloodBank.rhP_AB - existingBloodRequest.rhP_AB,
                    rhN_O: bloodBank.rhN_O - existingBloodRequest.rhN_O,
                    rhN_A: bloodBank.rhN_A - existingBloodRequest.rhN_A,
                    rhN_B: bloodBank.rhN_B - existingBloodRequest.rhN_B,
                    rhN_AB: bloodBank.rhN_AB - existingBloodRequest.rhN_AB,
                    plasmaRhP_O: bloodBank.plasmaRhP_O - existingBloodRequest.plasmaRhP_O,
                    plasmaRhP_A: bloodBank.plasmaRhP_A - existingBloodRequest.plasmaRhP_A,
                    plasmaRhP_B: bloodBank.plasmaRhP_B - existingBloodRequest.plasmaRhP_B,
                    plasmaRhP_AB: bloodBank.plasmaRhP_AB - existingBloodRequest.plasmaRhP_AB,
                    plasmaRhN_O: bloodBank.plasmaRhN_O - existingBloodRequest.plasmaRhN_O,
                    plasmaRhN_A: bloodBank.plasmaRhN_A - existingBloodRequest.plasmaRhN_A,
                    plasmaRhN_B: bloodBank.plasmaRhN_B - existingBloodRequest.plasmaRhN_B,
                    plasmaRhN_AB: bloodBank.plasmaRhN_AB - existingBloodRequest.plasmaRhN_AB,
                    plateletRhP_O: bloodBank.plateletRhP_O - existingBloodRequest.plateletRhP_O,
                    plateletRhP_A: bloodBank.plateletRhP_A - existingBloodRequest.plateletRhP_A,
                    plateletRhP_B: bloodBank.plateletRhP_B - existingBloodRequest.plateletRhP_B,
                    plateletRhP_AB: bloodBank.plateletRhP_AB - existingBloodRequest.plateletRhP_AB,
                    plateletRhN_O: bloodBank.plateletRhN_O - existingBloodRequest.plateletRhN_O,
                    plateletRhN_A: bloodBank.plateletRhN_A - existingBloodRequest.plateletRhN_A,
                    plateletRhN_B: bloodBank.plateletRhN_B - existingBloodRequest.plateletRhN_B,
                    plateletRhN_AB: bloodBank.plateletRhN_AB - existingBloodRequest.plateletRhN_AB,
                    rbcP_O: bloodBank.rbcP_O - existingBloodRequest.rbcP_O,
                    rbcP_A: bloodBank.rbcP_A - existingBloodRequest.rbcP_A,
                    rbcP_B: bloodBank.rbcP_B - existingBloodRequest.rbcP_B,
                    rbcP_AB: bloodBank.rbcP_AB - existingBloodRequest.rbcP_AB,
                    rbcN_O: bloodBank.rbcN_O - existingBloodRequest.rbcN_O,
                    rbcN_A: bloodBank.rbcN_A - existingBloodRequest.rbcN_A,
                    rbcN_B: bloodBank.rbcN_B - existingBloodRequest.rbcN_B,
                    rbcN_AB: bloodBank.rbcN_AB - existingBloodRequest.rbcN_AB,
                }
            });
        }
        if (existingBloodRequest.idOfOtherHospital && existingBloodRequest.idOfOtherHospital.length > 0) {
            const hospital = yield client_1.default.hospital.findUnique({ where: { id: existingBloodRequest.idOfOtherHospital } });
            if (!hospital) {
                throw new Error("Invalid hospital ID");
            }
            const updatedHospital = yield client_1.default.hospital.update({
                where: { id: existingBloodRequest.idOfOtherHospital },
                data: {
                    rhP_O: hospital.rhP_O - existingBloodRequest.rhP_O,
                    rhP_A: hospital.rhP_A - existingBloodRequest.rhP_A,
                    rhP_B: hospital.rhP_B - existingBloodRequest.rhP_B,
                    rhP_AB: hospital.rhP_AB - existingBloodRequest.rhP_AB,
                    rhN_O: hospital.rhN_O - existingBloodRequest.rhN_O,
                    rhN_A: hospital.rhN_A - existingBloodRequest.rhN_A,
                    rhN_B: hospital.rhN_B - existingBloodRequest.rhN_B,
                    rhN_AB: hospital.rhN_AB - existingBloodRequest.rhN_AB,
                    plasmaRhP_O: hospital.plasmaRhP_O - existingBloodRequest.plasmaRhP_O,
                    plasmaRhP_A: hospital.plasmaRhP_A - existingBloodRequest.plasmaRhP_A,
                    plasmaRhP_B: hospital.plasmaRhP_B - existingBloodRequest.plasmaRhP_B,
                    plasmaRhP_AB: hospital.plasmaRhP_AB - existingBloodRequest.plasmaRhP_AB,
                    plasmaRhN_O: hospital.plasmaRhN_O - existingBloodRequest.plasmaRhN_O,
                    plasmaRhN_A: hospital.plasmaRhN_A - existingBloodRequest.plasmaRhN_A,
                    plasmaRhN_B: hospital.plasmaRhN_B - existingBloodRequest.plasmaRhN_B,
                    plasmaRhN_AB: hospital.plasmaRhN_AB - existingBloodRequest.plasmaRhN_AB,
                    plateletRhP_O: hospital.plateletRhP_O - existingBloodRequest.plateletRhP_O,
                    plateletRhP_A: hospital.plateletRhP_A - existingBloodRequest.plateletRhP_A,
                    plateletRhP_B: hospital.plateletRhP_B - existingBloodRequest.plateletRhP_B,
                    plateletRhP_AB: hospital.plateletRhP_AB - existingBloodRequest.plateletRhP_AB,
                    plateletRhN_O: hospital.plateletRhN_O - existingBloodRequest.plateletRhN_O,
                    plateletRhN_A: hospital.plateletRhN_A - existingBloodRequest.plateletRhN_A,
                    plateletRhN_B: hospital.plateletRhN_B - existingBloodRequest.plateletRhN_B,
                    plateletRhN_AB: hospital.plateletRhN_AB - existingBloodRequest.plateletRhN_AB,
                    rbcP_O: hospital.rbcP_O - existingBloodRequest.rbcP_O,
                    rbcP_A: hospital.rbcP_A - existingBloodRequest.rbcP_A,
                    rbcP_B: hospital.rbcP_B - existingBloodRequest.rbcP_B,
                    rbcP_AB: hospital.rbcP_AB - existingBloodRequest.rbcP_AB,
                    rbcN_O: hospital.rbcN_O - existingBloodRequest.rbcN_O,
                    rbcN_A: hospital.rbcN_A - existingBloodRequest.rbcN_A,
                    rbcN_B: hospital.rbcN_B - existingBloodRequest.rbcN_B,
                    rbcN_AB: hospital.rbcN_AB - existingBloodRequest.rbcN_AB,
                }
            });
        }
        // Update Hospital Stock by adding the incoming stock
        yield client_1.default.hospital.update({
            where: { id: hospitalId },
            data: {
                rhP_O: hospital.rhP_O + existingBloodRequest.rhP_O,
                rhP_A: hospital.rhP_A + existingBloodRequest.rhP_A,
                rhP_B: hospital.rhP_B + existingBloodRequest.rhP_B,
                rhP_AB: hospital.rhP_AB + existingBloodRequest.rhP_AB,
                rhN_O: hospital.rhN_O + existingBloodRequest.rhN_O,
                rhN_A: hospital.rhN_A + existingBloodRequest.rhN_A,
                rhN_B: hospital.rhN_B + existingBloodRequest.rhN_B,
                rhN_AB: hospital.rhN_AB + existingBloodRequest.rhN_AB,
                plasmaRhP_O: hospital.plasmaRhP_O + existingBloodRequest.plasmaRhP_O,
                plasmaRhP_A: hospital.plasmaRhP_A + existingBloodRequest.plasmaRhP_A,
                plasmaRhP_B: hospital.plasmaRhP_B + existingBloodRequest.plasmaRhP_B,
                plasmaRhP_AB: hospital.plasmaRhP_AB + existingBloodRequest.plasmaRhP_AB,
                plasmaRhN_O: hospital.plasmaRhN_O + existingBloodRequest.plasmaRhN_O,
                plasmaRhN_A: hospital.plasmaRhN_A + existingBloodRequest.plasmaRhN_A,
                plasmaRhN_B: hospital.plasmaRhN_B + existingBloodRequest.plasmaRhN_B,
                plasmaRhN_AB: hospital.plasmaRhN_AB + existingBloodRequest.plasmaRhN_AB,
                plateletRhP_O: hospital.plateletRhP_O + existingBloodRequest.plateletRhP_O,
                plateletRhP_A: hospital.plateletRhP_A + existingBloodRequest.plateletRhP_A,
                plateletRhP_B: hospital.plateletRhP_B + existingBloodRequest.plateletRhP_B,
                plateletRhP_AB: hospital.plateletRhP_AB + existingBloodRequest.plateletRhP_AB,
                plateletRhN_O: hospital.plateletRhN_O + existingBloodRequest.plateletRhN_O,
                plateletRhN_A: hospital.plateletRhN_A + existingBloodRequest.plateletRhN_A,
                plateletRhN_B: hospital.plateletRhN_B + existingBloodRequest.plateletRhN_B,
                plateletRhN_AB: hospital.plateletRhN_AB + existingBloodRequest.plateletRhN_AB,
                rbcP_O: hospital.rbcP_O + existingBloodRequest.rbcP_O,
                rbcP_A: hospital.rbcP_A + existingBloodRequest.rbcP_A,
                rbcP_B: hospital.rbcP_B + existingBloodRequest.rbcP_B,
                rbcP_AB: hospital.rbcP_AB + existingBloodRequest.rbcP_AB,
                rbcN_O: hospital.rbcN_O + existingBloodRequest.rbcN_O,
                rbcN_A: hospital.rbcN_A + existingBloodRequest.rbcN_A,
                rbcN_B: hospital.rbcN_B + existingBloodRequest.rbcN_B,
                rbcN_AB: hospital.rbcN_AB + existingBloodRequest.rbcN_AB,
            }
        });
    }
    yield client_1.default.notification.create({
        data: {
            title: 'Blood request updated',
            content: `Your blood request has been updated.`,
            receivingHospitalId: existingBloodRequest.hospitalId,
            link: `/hdash/${existingBloodRequest.hospitalId}/r/requests/sent/${existingBloodRequest.id}`,
        }
    });
    return res.status(200).json({ message: 'Blood request updated successfully', updatedRequest });
}));
exports.findRequestById = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const bloodRequest = yield client_1.default.bloodRequest.findUnique({
        where: { id: id },
        include: {
            hospital: true,
            bloodBank: true,
            otherHospital: true
        }
    });
    if (!bloodRequest) {
        return res.status(404).json({ message: 'Blood request not found' });
    }
    res.status(200).json({ bloodRequest });
}));
exports.findRequestsByHospitalId = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hospitalId } = req.query;
    const bloodRequests = yield client_1.default.bloodRequest.findMany({
        where: {
            hospitalId: hospitalId
        },
        include: {
            hospital: true,
            bloodBank: true,
            otherHospital: true
        }
    });
    if (!bloodRequests.length) {
        return res.status(404).json({ message: 'No blood requests found for this hospital' });
    }
    res.status(200).json({ bloodRequests });
}));
exports.findReceivedRequestsByHospitalId = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hospitalId } = req.query;
    const bloodRequests = yield client_1.default.bloodRequest.findMany({
        where: {
            idOfOtherHospital: hospitalId
        },
        include: {
            hospital: true,
            bloodBank: true,
            otherHospital: true
        }
    });
    if (!bloodRequests.length) {
        return res.status(404).json({ bloodRequests: [] });
    }
    res.status(200).json({ bloodRequests });
}));
exports.findRequestsByBloodBankId = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bloodBankId } = req.query;
    const bloodRequests = yield client_1.default.bloodRequest.findMany({
        where: { bloodBankId: bloodBankId },
        include: {
            hospital: true,
            bloodBank: true,
            otherHospital: true
        }
    });
    if (!bloodRequests.length) {
        return res.status(404).json({ message: [] });
    }
    res.status(200).json({ bloodRequests });
}));
exports.deleteRequest = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    // Find the blood request by id
    const existingBloodRequest = yield client_1.default.bloodRequest.findUnique({
        where: { id: id }
    });
    if (!existingBloodRequest) {
        return res.status(404).json({ message: 'Blood request not found' });
    }
    // Delete the blood request
    yield client_1.default.bloodRequest.delete({
        where: { id: id }
    });
    res.status(200).json({ message: 'Blood request deleted successfully' });
}));
