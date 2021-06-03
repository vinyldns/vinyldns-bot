'use strict';

const dig_config = {
    valid_records: ["A", "AAAA", "ALIAS", "CNAME", "MX", "NS", "TXT", "PTR", "SOA", "SRV", "RRSIG", "DNSKEY", "DS", "NSEC", "NSEC3", "NSEC3PARAM", "AFSDB", "ATMA", "CAA", "CERT", "DHCID", "DNAME", "HINFO", "ISDN", "LOC"],
    dns_resolver: "my.resolver.net",
    dig_command: "dig"
};

module.exports = dig_config;
