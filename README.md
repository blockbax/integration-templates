# Integration Templates

Integration templates are templates defined by groups that are selectable and configurable within the Blockbax Platform. Templates are used to configure [Inbound Connectors](https://blockbax.com/docs/integrations/#inbound-connectors) that parse incoming payloads to ingested various measurements within the Blockbax Platform. This repository is used to manage all integration templates.

To add or update a template please read our [integration templates documentation](https://blockbax.com/docs/integrations/integration-templates#creating-or-updating-integration-templates).

## Examples

We added examples inside `examples/` directory which you can use as a basis for your own templates.

## Repository overview

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

### group

Inside this repository groups can configure their inbound connector templates inside the `groups` directory. Groups are added by including a `groups/<group-id>/index.yml` file. This is an example `index.yml`:

```yml
# group display name
# Maximum of 50 characters.
name: Your company
# group desciption
# Maximum of 150 characters.
description: Example for your company or group
# group contact information and socials (optional)
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

Each group defines their templates inside their group directory. These templates are configured inside the `groups/<group-id>/<template-id>/` directory.

#### Configuration

The template can be configured by creating a `config.yml` file inside the template directory. This is an example `config.yml`:

```yaml
# Version used to track changes
version: 1
# Template display name.
# Maximum of 50 characters.
name: Your template
# Template description to provide additional information.
# Maximum of 150 characters.
description: Your template description
# Template protocol
# Choose from HTTP, MQTT or CoAP.
protocol: HTTP
# Template protoco format.
# Choose from STRING, BYTES, JSON, CBOR.
payloadFormat: JSON
# A list of unique versions that are deprecated.
deprecatedVersions: []
```

The `protocol` and `payloadFormat` can be choosen from the following options:

| Field           | Options                             |
| --------------- | ----------------------------------- |
| `protocol`      | `HTTP`, `MQTT` or `CoAP`            |
| `payloadFormat` | `JSON`, `CBOR`, `STRING` or `BYTES` |

The `description` field is optional and the `version` field needs to be greater than `1`.

#### Testing

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

The `level` can be choosen from the following options:

| Field   | Options                   |
| ------- | ------------------------- |
| `level` | `INFO`, `WARN` or `ERROR` |

##### Payloads

Inside the `payloads/` directory you can add example payloads that you can use inside your tests file to automatically test your templates conversion script. The payload file is read in as a `utf-8` string and depending on the configured `payloadFormat` of the template it is parsed/decoded to the expected payload format. `CBOR` & `JSON` are parsed to javascript objects using their respective parsers. For the `STRINIG` type the raw string contents are used and for the `BYTES` type the contents of the payload are expected to be in hexadecimal characters.

Example payloads for each payload format can be found in the `examples/` directory.

#### Assets

Inside the `assets/` directory a `README.md` file can be added to provide documentation for your integration. This is optional and is not used for anything.
