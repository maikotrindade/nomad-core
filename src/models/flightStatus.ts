function flightStatusToInt(status: string): number {
  switch (status) {
    case "SCHEDULED":
    return 0;
    case "ACTIVE":
    return 1;
    case "LANDED":
    return 2;
    case "CANCELLED":
    return 3;
    case "INCIDENT":
    return 4;
    case "DIVERTED":
    return 5;
    case "REWARDED":
    return 6;
    default:
    return -1;
  }
}

export { flightStatusToInt };