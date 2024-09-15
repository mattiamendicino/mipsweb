var R_Format = /** @class */ (function () {
    function R_Format() {
    }
    R_Format.prototype.assemble = function (parts, instruction, registers) {
        if (parts.length !== 4)
            throw new Error("Invalid R-type instruction format");
        var rd = registers.getByName(parts[1]);
        var rs = registers.getByName(parts[2]);
        var rt = registers.getByName(parts[3]);
        if (!rd || !rs || !rt)
            throw new Error("Invalid register name");
        var code = (instruction.opcode << 26) |
            (rs.number << 21) |
            (rt.number << 16) |
            (rd.number << 11) |
            (0x00 << 6) |
            instruction.funct;
        var basic = "".concat(parts[0], " $").concat(rd.number, ", $").concat(rs.number, ", $").concat(rt.number);
        return {
            code: code,
            basic: basic
        };
    };
    R_Format.prototype.disassemble = function (binary, instruction) {
        var rs = (binary >> 21) & 0x1F;
        var rt = (binary >> 16) & 0x1F;
        var rd = (binary >> 11) & 0x1F;
        return { rs: rs, rt: rt, rd: rd };
    };
    return R_Format;
}());
export { R_Format };
var I_Format = /** @class */ (function () {
    function I_Format() {
    }
    I_Format.prototype.assemble = function (parts, instruction, registers) {
        if (parts.length !== 4)
            throw new Error("Invalid I-type instruction format");
        var rt = registers.getByName(parts[1]);
        var rs = registers.getByName(parts[2]);
        var immediate = Number(parts[3]);
        if (!rt || !rs || isNaN(immediate))
            throw new Error("Invalid register or immediate value");
        var code = (instruction.opcode << 26) |
            (rs.number << 21) |
            (rt.number << 16) |
            (immediate & 0xFFFF);
        var basic = "".concat(parts[0], " $").concat(rt.number, ", $").concat(rs.number, ", ").concat(immediate);
        return {
            code: code,
            basic: basic
        };
    };
    I_Format.prototype.disassemble = function (binary, instruction) {
        var rs = (binary >> 21) & 0x1F;
        var rt = (binary >> 16) & 0x1F;
        var immediate = binary & 0xFFFF;
        return { rs: rs, rt: rt, immediate: immediate };
    };
    return I_Format;
}());
export { I_Format };
var J_Format = /** @class */ (function () {
    function J_Format() {
    }
    J_Format.prototype.assemble = function (parts, instruction, registers) {
        if (parts.length !== 2)
            throw new Error("Invalid J-type instruction format");
        var address = Number(parts[1]);
        if (isNaN(address))
            throw new Error("Invalid address");
        var code = (instruction.opcode << 26) |
            (address & 0x03FFFFFF);
        var basic = "".concat(parts[0], " ").concat(address);
        return {
            code: code,
            basic: basic
        };
    };
    J_Format.prototype.disassemble = function (binary, instruction) {
        var address = binary & 0x03FFFFFF;
        return { address: address };
    };
    return J_Format;
}());
export { J_Format };