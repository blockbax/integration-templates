# Integration Templates

This repository contains the source for Blockbax integration templates. These templates can be use to parse incoming payloads
and ingest the data into Blockbax. You can find select one of these templates when configuring
[Inbound Connectors](https://blockbax.com/docs/integrations/#inbound-connectors).

## Examples

We added examples inside `examples/` directory which you can use as a basis for your own templates.

## Groups

```bash
groups/
├── <group-id>
│    ├── index.yml
│    ├── <template-id>
│    │    ├── config.yml
│    │    ├── script.js
│    │    ├── tests.yml
│    │    ├── payloads/
│    │    │    └── <payload-example>
│    │    ├── assets/
│    │    │    ├── README.md
```

The templates are grouped by vendor. Inside a group multiple templates can be defined. Each group should contain an `index.yml` file describing
the group. This is an example `index.yml`:

```yml
# Group display name (maximum of 50 characters)
name: Your company
# Group description (maximum of 150 characters)
description: Example for your company or group
# Group contact information and socials (optional)
contact:
    email: your@company.com
    website: https://www.your-company.com
    linkedin: https://www.linkedin.com/company/company-x/
    facebook: https://www.facebook.com/company-x
    twitter: company-x
    instagram: company-x
    github: company-x
```

The `contact` field is optional.

### Template

Each group can contain multiple templates. Each template is stored in its own directory:
`groups/<group-id>/<template-id>/`.

The template can be configured by creating a `config.yml` file inside the template directory. This is an example `config.yml`:

```yaml
# Version used to track changes
version: 1
# Template display name (maximum of 50 characters)
name: Your template
# Template description to provide additional information (maximum of 150 characters)
description: Your template description
# Template protocol
protocol: HTTP
# Template protocol format
payloadFormat: JSON
# A list of unique versions that are deprecated.
deprecatedVersions: []
```

The `protocol` and `payloadFormat` can be chosen from the following options:

| Field           | Options                             |
| --------------- | ----------------------------------- |
| `protocol`      | `HTTP`, `MQTT` or `CoAP`            |
| `payloadFormat` | `JSON`, `CBOR`, `STRING` or `BYTES` |

The `description` field is optional and the `version` field needs to be `1` or greater.

### Testing

To test your template you can define tests inside the `tests.yml` file. Tests are automatically run inside our CI pipelines and use the `script.js` file from the template. You can also run the tests locally by running `npm test`.

This is an example `tests.yml`, note that there should always be one `default` test:

```yaml
default:
    # at least one 'default' test
    description: Should ingest a number from the json file, log a test INFO message and log a test error
    payload: ./payloads/jsonPayloadExample.json
    expectedMeasurements:
        - ingestionId: test-subject-id$test-ingestion-id
          value: 2
          date: 2022-08-16T08:57:09.000+00:00
    expectedLogs:
        - level: INFO
          message: Test log
    expectedErrors:
        - message: Test error

test-measurements-from-json-payload:
    # Define more tests
```

The `level` can be chosen from the following options:

| Field   | Options                   |
| ------- | ------------------------- |
| `level` | `INFO`, `WARN` or `ERROR` |

#### Payloads

Inside the `payloads/` directory you can add example payloads that you can use inside your tests file to automatically test your templates conversion script. The payload file is read in as a `utf-8` string and, depending on the configured `payloadFormat` of the template, it is parsed/decoded to the expected payload format. `CBOR` & `JSON` are parsed to Javascript objects using their respective parsers. For the `STRING` type the raw string contents are used and for the `BYTES` type the contents of the payload are expected to be in hexadecimal characters.

Example payloads for each payload format can be found in the `examples/` directory.

#### Assets

Inside the `assets/` directory a `README.md` file can be added to provide documentation for your integration. This is optional and is not used for anything.
