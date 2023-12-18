using System;
using System.Threading.Tasks;
using NUnit.Allure.Attributes;
using NUnit.Allure.Core;
using NUnit.Framework;
using static Allure.Net.Commons.Steps.CoreStepsHelper;

namespace Allure.Examples.NUnit3.WebUITests
{
    [AllureNUnit]
    [AllureLabel("layer", "web")]
    abstract class WebUITestFixtureBase
    {
        protected Random Random { get; private set; }

        [SetUp]
        [AllureBefore("Setup session")]
        public async Task Setup()
        {
            this.Random = new Random();
            await Task.CompletedTask;
        }

        [TearDown]
        [AllureAfter("Dispose session")]
        public async Task Teardown()
        {
            await Step("Rollback changes", this.RollbackChanges);
            Step("Close session");
        }

        [AllureStep("Rollback changes")]
        protected virtual async Task RollbackChanges() => await Task.CompletedTask;

        protected async Task MaybeThrowElementNotFoundException()
        {
            if (this.IsTimeToThrowException())
            {
                throw new Exception(
                    "Element not found for xpath [//div[@class='something']]"
                );
            }
            await Task.CompletedTask;
        }

        protected async Task MaybeThrowAssertionException(string text)
        {
            if (this.IsTimeToThrowException())
            {
                Assert.That(text, Is.EqualTo("another text"));
            }
            await Task.CompletedTask;
        }

        bool IsTimeToThrowException()
        {
            return this.Random.Next(4) == 0;
        }
    }
}